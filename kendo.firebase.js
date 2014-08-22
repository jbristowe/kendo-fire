(function (f, define) {
  define([ './kendo.data' ], f);
})(function () {

'use strict';

var __meta__ = {
  id: 'data.firebase',
  category: 'data',
  name: 'Firebase',
  depends: [ 'data' ]
};

(function ($, undefined) {
  var kendo = window.kendo;

  kendo.data.transports.firebase = kendo.data.RemoteTransport.extend({
    create: function (options) {
      var data = this.parameterMap(options.data, 'create');
      delete data.id;

      this.requestId = kendo.guid();

      var fbRef = this.ref.push(data, function (error) {
        if (error) {
          options.fail();
        }
      });

      if (fbRef !== undefined) {
        var result = data;
        result.id = fbRef.name();
        options.success(result);
        delete this.requestId;
      }
    },

    destroy: function (options) {
      var data = this.parameterMap(options.data, 'update');
      this.ref.child(data.id).set(null, function (error) {
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
        throw new Error('The option, URL must be set.');
      }

      this.ref = new Firebase(url);
      kendo.data.RemoteTransport.fn.init.call(this, options);
    },

    push: function (callbacks) {
      this.ref.on('child_added', function (childSnapshot, prevChildName) {
        if (this.requestId !== undefined) {
          return;
        }
        var model = childSnapshot.val();
        model.id = childSnapshot.name();
        callbacks.pushUpdate(model);
      }, function() {}, this);

      this.ref.on('child_changed', function (childSnapshot, prevChildName) {
        var model = childSnapshot.val();
        model.id = childSnapshot.name();
        callbacks.pushUpdate(model);
      });

      this.ref.on('child_moved', function (childSnapshot, prevChildName) {
        var model = childSnapshot.val();
        model.id = childSnapshot.name();
        callbacks.pushUpdate(model);
      });

      this.ref.on('child_removed', function (oldChildSnapshot) {
        var model = oldChildSnapshot.val();
        model.id = oldChildSnapshot.name();
        callbacks.pushDestroy(model);
      });
    },

    read: function (options) {
      this.ref.once('value', function (dataSnapshot) {
        var data = [];
        dataSnapshot.forEach(function (childSnapshot) {
          var item = childSnapshot.val();
          item.id = childSnapshot.name();
          data.push(item);
        });
        options.success(data);
      });
    },

    update: function (options) {
      var id = options.data.id,
          data = this.parameterMap(options.data, 'update');

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

}, typeof define == 'function' && define.amd ? define : function (_, f) { f(); });