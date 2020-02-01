const dom = require("gulp-dom")

const defaults = [
	{ type: "media/webp", extension: "webp" }
]

module.exports = (formats = defaults) => dom(function () {
	this.querySelectorAll("IMG").forEach(img => {
		if(img.parentNode.nodeName != "PICTURE") {
			let pic = this.createElement("PICTURE")
			img.parentNode.insertBefore(pic, img)
			formats.forEach(fmt => {
				if("if" in fmt && !fmt.if(img)) return
				let src    = this.createElement("SOURCE")
				if("extension" in fmt) {
					let base = img.src.substr(0, img.src.lastIndexOf(".") + 1)
					src.srcset = base + fmt.extension
					if("srcTransform" in fmt) throw new Error("you cannot set am extension and a srcTransform")
				} else if("srcTransform" in fmt) {
					src.srcset = fmt.srcTransform(img.src)
				}
				if("type" in fmt) src.type = fmt.type
				if("media" in fmt) src.media = (
					typeof fmt.mime == "array"
						? fmt.media
						: [fmt.media]
				)
					.reduce((agg, m) => [...agg, ...m.split(/\s+/)])
					.join(" ")
				pic.appendChild(src)
			})
			pic.appendChild(img.parentNode.removeChild(img))
		}
	})
	return this
})
