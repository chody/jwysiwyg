/**
 * Controls: Image plugin
 * 
 * Depends on jWYSIWYG
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "wysiwyg.image.js depends on $.wysiwyg";
	}

	if (!$.wysiwyg.controls) {
		$.wysiwyg.controls = {};
	}

	/*
	 * Wysiwyg namespace: public properties and methods
	 */
	$.wysiwyg.controls.image = {
		init: function (Wysiwyg) {
			var self = this,
				formImageHtml = '<form class="wysiwyg"><fieldset><legend>Insert Image</legend>' +
					'<label>Preview: <img src="" alt="preview" style="float: left; margin: 5px; width: 80px; height: 60px; border: 1px solid rgb(192, 192, 192);"/></label>' +
					'<label>URL: <input type="text" name="src" value=""/></label>' +
					'<label>Title: <input type="text" name="imgtitle" value=""/></label>' +
					'<label>Description: <input type="text" name="description" value=""/></label>' +
					'<label>Width x Height: <input type="text" name="width" value="" class="width"/> x <input type="text" name="height" value="" class="height"/></label>' +
					'<label>Natural W x H: <input type="text" name="naturalWidth" value="" class="width" disabled="disabled"/> x ' +
					'<input type="text" name="naturalHeight" value="" class="height" disabled="disabled"/></label>' +
					'<input type="submit" class="button" value="Insert Image"/> ' +
					'<input type="reset" value="Cancel"/></fieldset></form>',
				img = {
					alt: "",
					self: Wysiwyg.dom.getElement("img"), // link to element node
					src: "http://",
					title: ""
				},
				elements,
				dialog,
				szURL;
	
			if (img.self) {
				img.src = img.self.src ? img.self.src : "";
				img.alt = img.self.alt ? img.self.alt : "";
				img.title = img.self.title ? img.self.title : "";
				img.width = img.self.width ? img.self.width : "";
				img.height = img.self.height ? img.self.height : "";
			}
	
			if ($.modal) {
				elements = $(formImageHtml);
				elements = self.makeForm(elements, img);
	
				$.modal(elements, {
					onShow: function (dialog) {
						$("input:submit", dialog.data).click(function (e) {
							e.preventDefault();
							var image,
								szURL = $('input[name="src"]', dialog.data).val(),
								title = $('input[name="imgtitle"]', dialog.data).val(),
								description = $('input[name="description"]', dialog.data).val(),
								width = $('input[name="width"]', dialog).val(),
								height = $('input[name="height"]', dialog).val(),
								style = [];
	
							if (img.self) {
								// to preserve all img attributes
								$(img.self).attr("src", szURL)
									.attr("title", title)
									.attr("alt", description);
								if (width) {
									$(img.self).attr("width", width);
								}
								if (height) {
									$(img.self).attr("height", height);
								}
							} else {
								if (width) {
									style.push("width: " + width + "px;");
								}
								if (height) {
									style.push("height: " + height + "px;");
								}
								
								if (style.length > 0) {
									style = ' style="' + style.join(" ") + '"';
								}
		
								image = "<img src='" + szURL + "' title='" + title + "' alt='" + description + "'" + style + "/>";
								Wysiwyg.insertHtml(image);
							}

							$.modal.close();
						});
						$("input:reset", dialog.data).click(function (e) {
							e.preventDefault();
							$.modal.close();
						});
					},
					maxWidth: Wysiwyg.defaults.formWidth,
					maxHeight: Wysiwyg.defaults.formHeight,
					overlayClose: true
				});
			} else if ($.fn.dialog) {
				elements = $(formImageHtml);
				elements = self.makeForm(elements, img);
	
				dialog = elements.appendTo("body");
				dialog.dialog({
					modal: true,
					width: Wysiwyg.defaults.formWidth,
					height: Wysiwyg.defaults.formHeight,
					open: function (ev, ui) {
						$("input:submit", dialog).click(function (e) {
							e.preventDefault();
							var image,
								szURL = $('input[name="src"]', dialog).val(),
								title = $('input[name="imgtitle"]', dialog).val(),
								description = $('input[name="description"]', dialog).val(),
								width = $('input[name="width"]', dialog).val(),
								height = $('input[name="height"]', dialog).val(),
								style = [];
	
							if (img.self) {
								// to preserve all img attributes
								$(img.self).attr("src", szURL)
									.attr("title", title)
									.attr("alt", description);
								if (width) {
									$(img.self).attr("width", width);
								}
								if (height) {
									$(img.self).attr("height", height);
								}
							} else {
								if (width) {
									style.push("width: " + width + "px;");
								}
								if (height) {
									style.push("height: " + height + "px;");
								}
								
								if (style.length > 0) {
									style = ' style="' + style.join(" ") + '"';
								}
		
								image = "<img src='" + szURL + "' title='" + title + "' alt='" + description + "'" + style + "/>";
								Wysiwyg.insertHtml(image);
							}

							$(dialog).dialog("close");
						});
						$("input:reset", dialog).click(function (e) {
							e.preventDefault();
							$(dialog).dialog("close");
						});
					},
					close: function (ev, ui) {
						dialog.dialog("destroy");
					}
				});
			} else {
				if ($.browser.msie) {
					Wysiwyg.ui.focus();
					Wysiwyg.editorDoc.execCommand("insertImage", true, null);
				} else {
					elements = $("<div/>")
						.css({"position": "absolute",
							"z-index": 2000,
							"left": "50%", "top": "50%", "background": "rgb(0, 0, 0)",
							"margin-top": -1 * Math.round(Wysiwyg.defaults.formHeight / 2),
							"margin-left": -1 * Math.round(Wysiwyg.defaults.formWidth / 2)})
						.html(formImageHtml);
					elements = self.makeForm(elements, img);
	
					$("input:submit", elements).click(function (event) {
						event.preventDefault();
	
						var image,
							szURL = $('input[name="src"]', elements).val(),
							title = $('input[name="imgtitle"]', elements).val(),
							description = $('input[name="description"]', elements).val(),
							width = $('input[name="width"]', elements).val(),
							height = $('input[name="height"]', elements).val(),
							style = [];
	
						if (img.self) {
							// to preserve all img attributes
							$(img.self).attr("src", szURL)
								.attr("title", title)
								.attr("alt", description);
							if (width) {
								$(img.self).attr("width", width);
							}
							if (height) {
								$(img.self).attr("height", height);
							}
						} else {
							if (width) {
								style.push("width: " + width + "px;");
							}
							if (height) {
								style.push("height: " + height + "px;");
							}
							
							if (style.length > 0) {
								style = ' style="' + style.join(" ") + '"';
							}
	
							image = "<img src='" + szURL + "' title='" + title + "' alt='" + description + "'" + style + "/>";
							Wysiwyg.insertHtml(image);
						}
						
						$(elements).remove();
					});
					$("input:reset", elements).click(function (event) {
						event.preventDefault();
	
						if ($.browser.msie) {
							Wysiwyg.ui.returnRange();
						}
	
						$(elements).remove();
					});
					
					$("body").append(elements);
				}
			}
	
			$(Wysiwyg.editorDoc).trigger("wysiwyg:refresh");
		},
		
		makeForm: function (form, img) {
			form.find("input[name=src]").val(img.src);
			form.find("input[name=imgtitle]").val(img.title);
			form.find("input[name=description]").val(img.alt);
			form.find('input[name="width"]').val(img.width);
			form.find('input[name="height"]').val(img.height);
			form.find('img').attr("src", img.src);

			form.find('img').bind("load", function () {
				if (form.find('img').attr("naturalWidth")) {
					form.find('input[name="naturalWidth"]').val(form.find('img').attr("naturalWidth"));
					form.find('input[name="naturalHeight"]').val(form.find('img').attr("naturalHeight"));
				}
			});

			form.find("input[name=src]").bind("change", function () {
				form.find('img').attr("src", this.value);
			});

			return form;
		}
	};

	$.wysiwyg.insertImage = function (object, szURL, attributes) {
		if ("object" !== typeof (object) || !object.context) {
			object = this;
		}

		if (!object.each) {
			console.error("Something goes wrong, check object");
		}

		return object.each(function () {
			var self = $(this).data("wysiwyg"),
				image,
				attribute;

			if (!self) {
				return this;
			}

			if (!szURL || szURL.length === 0) {
				return this;
			}

			if ($.browser.msie) {
				self.ui.focus();
			}

			if (attributes) {
				self.editorDoc.execCommand("insertImage", false, "#jwysiwyg#");
				image = self.getElementByAttributeValue("img", "src", "#jwysiwyg#");

				if (image) {
					image.src = szURL;

					for (attribute in attributes) {
						if (attributes.hasOwnProperty(attribute)) {
							image.setAttribute(attribute, attributes[attribute]);
						}
					}
				}
			} else {
				self.editorDoc.execCommand("insertImage", false, szURL);
			}

			$(self.editorDoc).trigger("wysiwyg:refresh");

			return this;
		});
	};
})(jQuery);