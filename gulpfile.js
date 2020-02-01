const { src, dest, series, parallel } = require("gulp");
const picTrans                        = require("./index.js")
const dom                             = require("gulp-dom")

const assert = (bool, msg) => { if(!bool) throw msg }

exports.defaultConf = () => src("test.html")
	.pipe( picTrans() )
	.pipe(dest("default"))

exports.complexConf = () => src("test.html")
	.pipe(
		picTrans(
			[
				{                                      type: "media/webp",  extension:    "webp"                                     },
				{                                      type: "media/heic",  srcTransform: file => file + ".heic"                     },
				{ if: img =>  img.src.match(/-xxx\./), media: ["1x", "2x"], srcTransform: file => file.replace(/-xxx\./, "-1and2x.") },
				{ if: img => !img.src.match(/-xxx\./), media: ["1x", "2x"], srcTransform: file => file + ".something-else"           },
			]
		)
	)
	.pipe(dest("complex"))

exports.testDefaultConf = () => src("default/test.html")
	.pipe(
		dom(function() {
			let pics = this.querySelectorAll("PICTURE")
			assert(pics.length == 3, "It should have be 3 pictures tags")

			let srcs = pics[0].querySelectorAll("SOURCE")
			assert(srcs.length == 1, "It should have 1 source")
			assert(srcs[0].srcset == "bla.webp", "The source's srcset should be 'bla.webp'")
			assert(srcs[0].type == "media/webp", "The source's type should be 'media/webp'")
			assert(!srcs[0].media, "The source's media should not be defined")
			let img = pics[0].querySelectorAll("IMG")
			assert(img.length == 1, "It should only have 1 img")
			assert(img[0].src = "bla.ble")

			srcs = pics[1].querySelectorAll("SOURCE")
			assert(srcs.length == 1, "It should have 1 source")
			assert(srcs[0].srcset == "ble-xxx.webp", "The source's srcset should be 'ble-xxx.webp'")
			assert(srcs[0].type == "media/webp", "The source's type should be 'media/webp'")
			assert(!srcs[0].media, "The source's media should not be defined")
			img = pics[1].querySelectorAll("IMG")
			assert(img.length == 1, "It should only have 1 img")
			assert(img[0].src = "bla.ble")

			srcs = pics[2].querySelectorAll("SOURCE")
			img = pics[2].querySelectorAll("IMG")
			assert(img.length == 1, "It should only have 1 img")
			assert(img[0].src = "bla.ble")
		})
	)

exports.testComplexConf = () => src("complex/test.html")
	.pipe(
		dom(function() {
			let pics = this.querySelectorAll("PICTURE")
			assert(pics.length == 3, "It should have be 3 pictures tags")

			let srcs = pics[0].querySelectorAll("SOURCE")
			assert(srcs.length == 3, "It should have 3 source")
			assert(srcs[0].srcset == "bla.webp", "The source's srcset should be 'bla.webp'")
			assert(srcs[0].type == "media/webp", "The source's type should be 'media/webp'")
			assert(!srcs[0].media, "The source's media should not be defined")
			assert(srcs[1].srcset == "bla.ble.heic", "The source's srcset should be 'bla.ble.heic'")
			assert(srcs[1].type == "media/heic", "The source's type should be 'media/heic'")
			assert(!srcs[1].media, "The source's media should not be defined")
			assert(srcs[2].srcset == "bla.ble.something-else", "The source's srcset should be 'bla.ble.something-else'")
			assert(srcs[2].media == "1x 2x", "The source's media should be '1x 2x'")
			assert(!srcs[2].type, "The source's type should not be defined")
			let img = pics[0].querySelectorAll("IMG")
			assert(img.length == 1, "It should only have 1 img")
			assert(img[0].src = "bla.ble")

			srcs = pics[1].querySelectorAll("SOURCE")
			assert(srcs.length == 3, "It should have 3 source")
			assert(srcs[0].srcset == "ble-xxx.webp", "The source's srcset should be 'ble-xxx.webp'")
			assert(srcs[0].type == "media/webp", "The source's type should be 'media/webp'")
			assert(!srcs[0].media, "The source's media should not be defined")
			assert(srcs[1].srcset == "ble-xxx.jpg.heic", "The source's srcset should be 'ble-xxx.jpg.heic'")
			assert(srcs[1].type == "media/heic", "The source's type should be 'media/heic'")
			assert(!srcs[1].media, "The source's media should not be defined")
			assert(srcs[2].srcset == "ble-1and2x.jpg", "The source's srcset should be 'ble-1and2x.jpg'")
			assert(srcs[2].media == "1x 2x", "The source's media should be '1x 2x'")
			assert(!srcs[2].type, "The source's type should not be defined")
			img = pics[1].querySelectorAll("IMG")
			assert(img.length == 1, "It should only have 1 img")
			assert(img[0].src = "bla.ble")

			srcs = pics[2].querySelectorAll("SOURCE")
			img = pics[2].querySelectorAll("IMG")
			assert(img.length == 1, "It should only have 1 img")
			assert(img[0].src = "bla.ble")
		})
	)
