kendo-fire
==========

**kendo-fire** is a set of [Kendo UI](http://www.telerik.com/kendo-ui) bindings for [Firebase](https://www.firebase.com/).

# Demontration Video

[![ScreenShot](https://i.ytimg.com/vi/FDXoAlYLDqo/maxresdefault.jpg)](http://youtu.be/FDXoAlYLDqo)

# Usage

```html
<!-- Kendo UI Core / Kendo UI Professional -->
<script src="kendo.all.min.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/[version]/firebase[-debug].js"></script>

<!-- kendo-fire -->
<script src="kendo.firebase.js"></script>
```

```javascript
var dataSource = new kendo.data.DataSource({
  autoSync: true, // recommended
  transport: {
    firebase: {
      url: "[firebaseURL]"
    }
  },
  type: "firebase"
});
```
