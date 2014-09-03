kendo-fire
==========

**kendo-fire** is a set of [Kendo UI](http://www.telerik.com/kendo-ui) bindings for [Firebase](https://www.firebase.com/).

# Demo Video

[![ScreenShot](https://i.ytimg.com/vi/FDXoAlYLDqo/maxresdefault.jpg)](http://youtu.be/FDXoAlYLDqo)

# Usage

Install kendo-fire along with its dependencies via [bower](http://bower.io/):

```bash
$ bower install kendo-fire
```

Add references to your markup:

```html
<!-- Kendo UI Core / Kendo UI Professional -->
<script src="kendo.all.min.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/[version]/firebase[-debug].js"></script>

<!-- kendo-fire -->
<script src="kendo.firebase.js"></script>
```

Utilise the binding via a **kendo.data.DataSource**:

```javascript
var dataSource = new kendo.data.DataSource({
  autoSync: true, // recommended
  schema: {
    model: {
      id: 'id'
      ...
    }
  },
  transport: {
    firebase: {
      url: "[firebaseURL]"
    }
  },
  type: "firebase"
});
```
