(function(f, define){
    define([ "./kendo.data" ], f);
})(function(){

var __meta__ = {
    id: "data.firebase",
    category: "data",
    name: "Firebase",
    depends: [ "data" ]
};

(function($) {

  "use strict";

  var isArray = $.isArray;
  kendo.Firebase = kendo.Firebase || {};

  kendo.Firebase.DataSource = kendo.data.DataSource.extend({
    pushCreate: function(items) {
      if (!isArray(items)) {
        items = [items];
      }

      for (var idx = 0; idx < items.length; idx ++) {
      };

      var pushed = [];
      var autoSync = this.options.autoSync;
      this.options.autoSync = false;

      try {
        for (var idx = 0; idx < items.length; idx ++) {
          var item = items[idx];

          if (this.indexOf(item.id) === -1) {
            continue;
          }

          var result = this.add(item);

          pushed.push(result);

          var pristine = result.toJSON();

          if (this._isServerGrouped()) {
            pristine = wrapInEmptyGroup(this.group(), pristine);
          }

          this._pristineData.push(pristine);
        }
      } finally {
        this.options.autoSync = autoSync;
      }

      if (pushed.length) {
        this.trigger("push", {
          type: "create",
          items: pushed
        });
      }
    }
  });

  kendo.data.transports.firebase = kendo.data.RemoteTransport.extend({
    create: function(options) {
      var data = this.parameterMap(options.data, "create");
      delete data.id;
      var id = this.ref.push().name();
      this.ref.child(id).set(data, function(error) {
        if (!error) {
          var result = data;
          result.id = id;
          options.success(result);
        } else {
          options.fail();
        }
      });
    },

    destroy: function(options) {
      var data = this.parameterMap(options.data, "update");
      this.ref.child(data.id).set(null, function(error) {
        if (!error) {
          var result = data;
          result.id = data.id;
          options.success(result);
        } else {
          options.fail();
        }
      });
    },

    init: function (options) {
      var firebase = options && options.firebase ? options.firebase : {};

      var url = firebase.url;
      if (!url) {
        throw new Error('The "url" option must be set.');
      }

      this.ref = new Firebase(url);
      kendo.data.RemoteTransport.fn.init.call(this, options);
    },

    push: function(callbacks) {
      this.ref.on("child_added", function(childSnapshot, prevChildName) {
        var model = childSnapshot.val();
        model.id = childSnapshot.name();
        callbacks.pushUpdate(model);
      });

      this.ref.on("child_changed", function(childSnapshot, prevChildName) {
        var model = childSnapshot.val();
        model.id = childSnapshot.name();
        callbacks.pushUpdate(model);
      });

      this.ref.on("child_moved", function(childSnapshot, prevChildName) {
        var model = childSnapshot.val();
        model.id = childSnapshot.name();
        callbacks.pushUpdate(model);
      });

      this.ref.on("child_removed", function(oldChildSnapshot) {
        var model = oldChildSnapshot.val();
        model.id = oldChildSnapshot.name();
        callbacks.pushDestroy(model);
      });
    },

    read: function (options) {
      this.ref.once("value", function(dataSnapshot) {
        var data = [];
        dataSnapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
          item.id = childSnapshot.name();
          data.push(item);
        });
        options.success(data);
      });
    },

    update: function(options) {
      var id = options.data.id;
      var data = this.parameterMap(options.data, "update");
      delete data.id;
      this.ref.child(id).set(data, function(error) {
        if (!error) {
          var result = data;
          result.id = id;
          options.success(result);
        } else {
          options.fail();
        }
      });
    }
  });
})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });