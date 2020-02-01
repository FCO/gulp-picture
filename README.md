## index.html
```html
<body>
	<img src="bla.ble" />
	<img src="ble-xxx.jpg" />
	<picture>
		<img src="this_should_not_change.jpg" />
	</picture>
</body>
```

## gulpfile.js
```javascript
const { src, dest } = require("gulp");
const picTrans      = require("./index.js")

exports.defaultConf = () => src("test.html")
	.pipe( picTrans() )
	.pipe(dest("default"))

exports.complexConf = () => src("test.html")
	.pipe(
		picTrans([
			{                                      type: "media/webp",  extension:    "webp"                                     },
			{                                      type: "media/heic",  srcTransform: file => file + ".heic"                     },
			{ if: img =>  img.src.match(/-xxx\./), media: ["1x", "2x"], srcTransform: file => file.replace(/-xxx\./, "-1and2x.") },
			{ if: img => !img.src.match(/-xxx\./), media: ["1x", "2x"], srcTransform: file => file + ".something-else"           },
		])
	)
	.pipe(dest("complex"))
```

## defaultConf generates:
```html
<html><head></head><body>
	<picture><source srcset="bla.webp" type="media/webp"><img src="bla.ble"></picture>
	<picture><source srcset="ble-xxx.webp" type="media/webp"><img src="ble-xxx.jpg"></picture>
	<picture>
		<img src="this_should_not_change.jpg">
	</picture>

</body></html>
```

## and complexConf
```html
<html><head></head><body>
	<picture><source srcset="bla.webp" type="media/webp"><source srcset="bla.ble.heic" type="media/heic"><source srcset="bla.ble.something-else" media="1x 2x"><img src="bla.ble"></picture>
	<picture><source srcset="ble-xxx.webp" type="media/webp"><source srcset="ble-xxx.jpg.heic" type="media/heic"><source srcset="ble-1and2x.jpg" media="1x 2x"><img src="ble-xxx.jpg"></picture>
	<picture>
		<img src="this_should_not_change.jpg">
	</picture>

</body></html>
```
