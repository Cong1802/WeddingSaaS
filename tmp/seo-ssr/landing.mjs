import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ArrowRight, Brush, ChartColumn, Check, ChevronDown, ChevronLeft, ChevronRight, Crown, Eye, Flower2, FolderHeart, Gem, Gift, Headphones, Heart, Home, Image, LayoutGrid, Leaf, LogOut, Mail, Menu, MessageCircle, Music2, QrCode, Quote, Settings, Shield, ShieldCheck, Sparkles, Star, UserRound, Users, X, Zap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { createPortal } from "react-dom";
//#region src/templates/useTemplates.js
var normalizeTemplate = (template) => ({
	...template,
	databaseId: template.id,
	id: template.code,
	fileUrl: template.file_url || "/template.html"
});
function useTemplates() {
	const [templates, setTemplates] = useState([]);
	useEffect(() => {
		let active = true;
		const load = () => fetch("/api/public/templates", { headers: { Accept: "application/json" } }).then((response) => {
			if (!response.ok) throw new Error("Unable to load templates");
			return response.json();
		}).then((data) => {
			if (active && data.success) setTemplates(data.templates.map(normalizeTemplate));
		}).catch((error) => console.error(error));
		load();
		window.addEventListener("templates-updated", load);
		return () => {
			active = false;
			window.removeEventListener("templates-updated", load);
		};
	}, []);
	return templates;
}
//#endregion
//#region images/section-02-why-us/why-us-background-hero-matched.webp
var why_us_background_hero_matched_default = "/dist/assets/why-us-background-hero-matched-CzAZK44H.webp";
//#endregion
//#region src/components/TemplateGallery.jsx
var categories = [
	{
		id: "all",
		label: "Tất cả",
		icon: LayoutGrid
	},
	{
		id: "modern",
		label: "Hiện đại",
		icon: Leaf
	},
	{
		id: "traditional",
		label: "Truyền thống",
		icon: Flower2
	},
	{
		id: "minimal",
		label: "Tối giản",
		icon: Gem
	},
	{
		id: "luxury",
		label: "Sang trọng",
		icon: Crown
	},
	{
		id: "vintage",
		label: "Vintage",
		icon: Image
	}
];
function TemplateGallery({ onGoToEditor }) {
	const previews = useTemplates().map((template) => {
		const categoryMap = {
			"Hiện Đại": "modern",
			"Hiện đại": "modern",
			"Truyền Thống": "traditional",
			"Cổ Điển": "traditional",
			"Tối Giản": "minimal",
			"Sang Trọng": "luxury",
			"Vintage": "vintage"
		};
		return {
			...template,
			categoryLabel: template.category,
			category: categoryMap[template.category] || "modern",
			image: template.thumbnail
		};
	});
	const [category, setCategory] = useState("all");
	const [favorites, setFavorites] = useState([]);
	const [expanded, setExpanded] = useState(false);
	const slider = useRef(null);
	const dragStartPosRef = useRef(null);
	const isMovedRef = useRef(false);
	const [edges, setEdges] = useState({
		beginning: true,
		end: false,
		locked: false
	});
	const cards = previews.filter((card) => category === "all" || card.category === category);
	const slides = cards.length > 1 ? [...cards, ...cards] : cards;
	const changeCategory = (id) => {
		setCategory(id);
	};
	const updateEdges = (swiper) => setEdges({
		beginning: swiper.isBeginning,
		end: swiper.isEnd,
		locked: swiper.isLocked
	});
	const move = (direction) => direction < 0 ? slider.current?.slidePrev() : slider.current?.slideNext();
	const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
	const handlePointerDown = (e) => {
		const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
		const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
		dragStartPosRef.current = {
			x: clientX,
			y: clientY
		};
		isMovedRef.current = false;
	};
	const handlePointerMove = (e) => {
		if (!dragStartPosRef.current) return;
		const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
		const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
		if (Math.hypot(clientX - dragStartPosRef.current.x, clientY - dragStartPosRef.current.y) > 6) isMovedRef.current = true;
	};
	const handleCardClick = (cardId) => {
		if (isMovedRef.current) return;
		onGoToEditor(cardId);
	};
	const renderCard = (card, keyPrefix = "") => /* @__PURE__ */ jsxs("article", {
		className: "template-gallery__card",
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "template-gallery__preview",
				onClick: () => handleCardClick(card.id),
				"aria-label": `Dùng mẫu ${card.name}`,
				children: /* @__PURE__ */ jsx("img", {
					src: card.image,
					alt: `Ảnh minh họa mẫu ${card.name}`,
					loading: "lazy"
				})
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: `template-gallery__favorite${favorites.includes(card.id) ? " is-favorite" : ""}`,
				"aria-label": `${favorites.includes(card.id) ? "Bỏ yêu thích" : "Yêu thích"} ${card.name}`,
				"aria-pressed": favorites.includes(card.id),
				onClick: (e) => {
					e.stopPropagation();
					toggleFavorite(card.id);
				},
				children: /* @__PURE__ */ jsx(Heart, {
					size: 23,
					fill: favorites.includes(card.id) ? "currentColor" : "none"
				})
			}),
			/* @__PURE__ */ jsx("span", {
				className: "template-gallery__label",
				children: card.categoryLabel
			})
		]
	});
	return /* @__PURE__ */ jsx("section", {
		id: "templates",
		className: "template-gallery",
		style: {
			"--section-artwork": `url(${why_us_background_hero_matched_default})`,
			"--section-artwork-opacity": 1
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "template-gallery__inner",
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "template-gallery__heading",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "template-gallery__badge",
							children: [/* @__PURE__ */ jsx(Flower2, { size: 16 }), " Kho mẫu thiệp đẹp"]
						}),
						/* @__PURE__ */ jsxs("h2", { children: ["Kho Mẫu Thiệp Cưới ", /* @__PURE__ */ jsx("em", { children: "Đa Dạng & Tinh Tế" })] }),
						/* @__PURE__ */ jsxs("p", { children: [
							"Hàng trăm mẫu thiệp cưới được thiết kế sẵn, phù hợp với nhiều phong cách",
							/* @__PURE__ */ jsx("br", { className: "template-gallery__desktop-break" }),
							" từ hiện đại, tối giản đến sang trọng, truyền thống."
						] })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "template-gallery__filters",
					"aria-label": "Lọc phong cách thiệp",
					children: categories.map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: category === id ? "is-active" : "",
						"aria-pressed": category === id,
						onClick: () => changeCategory(id),
						children: [/* @__PURE__ */ jsx(Icon, { size: 20 }), label]
					}, id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "template-gallery__carousel",
					children: [
						!expanded && !edges.locked && cards.length > 1 && /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "template-gallery__arrow template-gallery__arrow--left",
							"aria-label": "Mẫu trước",
							onClick: () => move(-1),
							children: /* @__PURE__ */ jsx(ChevronLeft, { size: 23 })
						}),
						expanded ? /* @__PURE__ */ jsx("div", {
							className: "template-gallery__track is-expanded",
							children: cards.map((card) => /* @__PURE__ */ jsx("div", { children: renderCard(card) }, card.id))
						}) : /* @__PURE__ */ jsx(Swiper, {
							className: "template-gallery__slider",
							modules: [A11y, Keyboard],
							loop: cards.length > 1,
							slidesPerView: 1.3,
							spaceBetween: 14,
							speed: 450,
							grabCursor: true,
							keyboard: {
								enabled: true,
								onlyInViewport: true
							},
							watchOverflow: true,
							onSwiper: (swiper) => {
								slider.current = swiper;
								updateEdges(swiper);
							},
							onSlideChange: updateEdges,
							onResize: updateEdges,
							onLock: updateEdges,
							onUnlock: updateEdges,
							breakpoints: {
								641: {
									slidesPerView: 3,
									spaceBetween: 18
								},
								1101: {
									slidesPerView: 5,
									spaceBetween: 28
								}
							},
							a11y: {
								containerMessage: "Kho mẫu thiệp cưới",
								itemRoleDescriptionMessage: "Mẫu thiệp",
								slideLabelMessage: "Mẫu {{index}} trên {{slidesLength}}"
							},
							children: slides.map((card, idx) => /* @__PURE__ */ jsx(SwiperSlide, { children: renderCard(card) }, `${card.id}-${idx}`))
						}, category),
						!expanded && !edges.locked && cards.length > 1 && /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "template-gallery__arrow template-gallery__arrow--right",
							"aria-label": "Mẫu tiếp theo",
							onClick: () => move(1),
							children: /* @__PURE__ */ jsx(ChevronRight, { size: 23 })
						})
					]
				}),
				/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "template-gallery__cta",
					onClick: () => {
						setCategory("all");
						setExpanded((current) => !current);
					},
					children: [expanded ? "Thu gọn mẫu thiệp" : "Xem tất cả mẫu thiệp", /* @__PURE__ */ jsx(ArrowRight, { size: 19 })]
				})
			]
		})
	});
}
//#endregion
//#region images/section-02-why-us/why-us-background-v2.webp
var why_us_background_v2_default = "/dist/assets/why-us-background-v2-TjRr-F7D.webp";
//#endregion
//#region images/section-02-why-us/why-us-product-no-base-matched.webp
var why_us_product_no_base_matched_default = "/dist/assets/why-us-product-no-base-matched-DJ4JRbhM.webp";
//#endregion
//#region src/components/WhyUsSection.jsx
var features$1 = [
	{
		icon: LayoutGrid,
		title: "Đa dạng mẫu thiệp",
		description: "Hàng trăm mẫu thiệp thiết kế hiện đại, dễ dàng tùy chỉnh theo phong cách của bạn."
	},
	{
		icon: Users,
		title: "Quản lý khách mời",
		description: "Tính năng RSVP thông minh, dễ dàng theo dõi và quản lý danh sách khách mời."
	},
	{
		icon: Gift,
		title: "Mừng cưới QR",
		description: "Tích hợp mã QR mừng cưới, thuận tiện, an toàn và hiện đại."
	},
	{
		icon: Headphones,
		title: "Tự động 24/7",
		description: "Hệ thống hoạt động ổn định, hỗ trợ bạn mọi lúc, mọi nơi."
	}
];
function WhyUsSection() {
	return /* @__PURE__ */ jsx("section", {
		id: "whyus",
		className: "why-us",
		"aria-labelledby": "why-us-title",
		style: {
			"--section-artwork": `url(${why_us_background_v2_default})`,
			"--section-artwork-opacity": 1
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "why-us__inner",
			children: [/* @__PURE__ */ jsx("div", {
				className: "why-us__visual",
				children: /* @__PURE__ */ jsx("img", {
					className: "why-us__showcase",
					src: why_us_product_no_base_matched_default,
					alt: "Bộ thiệp cưới Minh Quân và Thảo Vy cùng phong bì hồng, dấu sáp và thiệp online trên điện thoại",
					loading: "lazy",
					width: "1536",
					height: "1024"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "why-us__content",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "why-us__heading",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "why-us__badge",
								children: [/* @__PURE__ */ jsx(Heart, { size: 16 }), "Vì sao chọn WeddingSaaS?"]
							}),
							/* @__PURE__ */ jsxs("h2", {
								id: "why-us-title",
								children: ["Vì sao", /* @__PURE__ */ jsx("em", { children: "WeddingSaaS?" })]
							}),
							/* @__PURE__ */ jsx("p", { children: "Biến câu chuyện tình yêu của bạn thành những tấm thiệp cưới online đẹp mắt, tinh tế và đầy cảm xúc. WeddingSaaS giúp bạn tiết kiệm thời gian, chi phí nhưng vẫn đảm bảo sự sang trọng và khác biệt." })
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "why-us__features",
						children: features$1.map(({ icon: Icon, title, description }) => /* @__PURE__ */ jsxs("article", {
							className: "why-us__feature",
							children: [/* @__PURE__ */ jsx("span", {
								className: "why-us__icon",
								children: /* @__PURE__ */ jsx(Icon, {
									size: 34,
									strokeWidth: 1.8
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", { children: title }), /* @__PURE__ */ jsx("p", { children: description })] })]
						}, title))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "why-us__divider",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ jsx("span", {}),
							/* @__PURE__ */ jsx(Heart, { size: 20 }),
							/* @__PURE__ */ jsx("span", {})
						]
					})
				]
			})]
		})
	});
}
//#endregion
//#region images/section-01-hero/hero-pastel-curtain-bg3.webp
var hero_pastel_curtain_bg3_default = "/dist/assets/hero-pastel-curtain-bg3-NwAf7X3a.webp";
//#endregion
//#region images/section-01-hero/hero-reference-product.webp
var hero_reference_product_default = "/dist/assets/hero-reference-product-sEpD0bk9.webp";
//#endregion
//#region src/components/HeroSection.jsx
var benefits = [
	{
		icon: LayoutGrid,
		title: "Đa dạng mẫu thiệp",
		detail: "Hiện đại & sang trọng"
	},
	{
		icon: Users,
		title: "Quản lý khách mời",
		detail: "RSVP tự động"
	},
	{
		icon: Gift,
		title: "Mừng cưới QR",
		detail: "Tiện lợi & an toàn"
	},
	{
		icon: Headphones,
		title: "Tự động 24/7",
		detail: "Tạo thiệp xong ngay"
	}
];
function HeroSection({ onCreate, onViewTemplates }) {
	return /* @__PURE__ */ jsx("section", {
		id: "home",
		className: "landing-hero",
		"aria-labelledby": "hero-title",
		style: {
			"--section-artwork": `url(${hero_pastel_curtain_bg3_default})`,
			"--section-artwork-opacity": 1
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "landing-hero__inner",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "landing-hero__copy",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "landing-hero__heading",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "landing-hero__badge",
							children: [/* @__PURE__ */ jsx(Sparkles, { size: 16 }), "Nền tảng tạo thiệp cưới online dễ sử dụng"]
						}), /* @__PURE__ */ jsxs("h1", {
							id: "hero-title",
							children: ["Tạo Thiệp Cưới Online", /* @__PURE__ */ jsx("em", { children: "Đẹp - Sang Trọng - Dễ Dàng" })]
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "landing-hero__description",
						children: "Thể hiện câu chuyện tình yêu riêng biệt với bộ sưu tập mẫu thiệp cưới điện tử sang trọng. Gửi lời mời tinh tế, nhận phản hồi RSVP và mừng cưới trực tuyến chỉ trong 5 phút."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "landing-hero__benefits",
						children: benefits.map(({ icon: Icon, title, detail }) => /* @__PURE__ */ jsxs("div", {
							className: "landing-hero__benefit",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "landing-hero__icon",
									children: /* @__PURE__ */ jsx(Icon, {
										size: 28,
										strokeWidth: 1.8
									})
								}),
								/* @__PURE__ */ jsx("h2", { children: title }),
								/* @__PURE__ */ jsx("p", { children: detail })
							]
						}, title))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "landing-hero__actions",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							className: "landing-hero__primary",
							onClick: onCreate,
							children: ["Bắt Đầu Tạo Thiệp Miễn Phí", /* @__PURE__ */ jsx(ArrowRight, { size: 19 })]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							className: "landing-hero__secondary",
							onClick: onViewTemplates,
							children: [/* @__PURE__ */ jsx(Eye, { size: 19 }), "Xem Mẫu Thiệp"]
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "landing-hero__trust",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 22 }), "Cam kết bảo mật & Trải nghiệm thiệp cưới chất lượng cao"]
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "landing-hero__visual",
				children: /* @__PURE__ */ jsx("img", {
					src: hero_reference_product_default,
					alt: "Thiệp cưới hoa hồng, phong bì hồng với dấu sáp và thiệp online trên điện thoại",
					width: "1536",
					height: "1024",
					fetchPriority: "high"
				})
			})]
		})
	});
}
//#endregion
//#region images/section-04-how-it-works/steps-illustrations.webp
var steps_illustrations_default = "/dist/assets/steps-illustrations-BPIoigr7.webp";
//#endregion
//#region src/components/HowItWorksSection.jsx
var steps = [
	{
		title: "Chọn Mẫu Thiệp",
		description: "Lựa chọn từ kho mẫu thiệp đa dạng phong cách phù hợp với đám cưới của bạn."
	},
	{
		title: "Tùy Chỉnh Nội Dung",
		description: "Nhập thông tin cô dâu, chú rể, thời gian, địa điểm và tải lên album ảnh cưới."
	},
	{
		title: "Cá Nhân Hóa Thiết Kế",
		description: "Thêm ảnh, chọn hiệu ứng, điều chỉnh bố cục và các chi tiết để tấm thiệp thật tinh tế và mang dấu ấn riêng."
	},
	{
		title: "Lưu & Chia Sẻ",
		description: "Nhận đường dẫn thiệp riêng biệt và gửi tới người thân, bạn bè qua Zalo/Facebook."
	}
];
function HowItWorksSection({ onCreate }) {
	return /* @__PURE__ */ jsx("section", {
		id: "steps",
		className: "wedding-steps",
		"aria-labelledby": "wedding-steps-title",
		style: {
			"--section-artwork": `url(${hero_pastel_curtain_bg3_default})`,
			"--section-artwork-opacity": 1
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "wedding-steps__inner",
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "wedding-steps__heading",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "wedding-steps__badge",
							children: [/* @__PURE__ */ jsx(Zap, {
								size: 16,
								fill: "currentColor"
							}), "4 bước đơn giản"]
						}),
						/* @__PURE__ */ jsxs("h2", {
							id: "wedding-steps-title",
							children: ["Tạo Thiệp Cưới Online", /* @__PURE__ */ jsx("em", { children: "Chỉ Trong 5 Phút" })]
						}),
						/* @__PURE__ */ jsx("p", { children: "Từ ý tưởng đến tấm thiệp hoàn hảo — dễ dàng tạo thiệp cưới đẹp mang dấu ấn riêng của hai bạn." })
					]
				}),
				/* @__PURE__ */ jsx("ol", {
					className: "wedding-steps__list",
					children: steps.map(({ title, description }, index) => /* @__PURE__ */ jsxs("li", {
						className: "wedding-steps__card",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "wedding-steps__visual",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "wedding-steps__number",
									children: ["0", index + 1]
								}), /* @__PURE__ */ jsx("div", {
									className: "wedding-steps__artwork",
									style: {
										backgroundImage: `url(${steps_illustrations_default})`,
										backgroundPosition: `${index * 100 / 3}% center`
									}
								})]
							}),
							/* @__PURE__ */ jsx("h3", { children: title }),
							/* @__PURE__ */ jsx("p", { children: description }),
							index < steps.length - 1 && /* @__PURE__ */ jsxs("span", {
								className: "wedding-steps__connector",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ jsx("svg", {
									viewBox: "0 0 200 70",
									preserveAspectRatio: "none",
									children: /* @__PURE__ */ jsx("path", { d: "M0 45 C45 5 65 5 100 30 S160 65 200 25" })
								}), /* @__PURE__ */ jsx(Heart, {
									size: 13,
									fill: "currentColor"
								})]
							})
						]
					}, title))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "wedding-steps__action",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: onCreate,
						children: ["Bắt Đầu Tạo Thiệp Miễn Phí", /* @__PURE__ */ jsx(ArrowRight, { size: 19 })]
					}), /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(ShieldCheck, {
						size: 15,
						fill: "currentColor"
					}), "Miễn phí trải nghiệm, tùy chỉnh theo phong cách của bạn"] })]
				})
			]
		})
	});
}
//#endregion
//#region src/assets/logo.webp
var logo_default = "/dist/assets/logo-B1RfQp05.webp";
//#endregion
//#region images/section-08-footer/footer-background.webp
var footer_background_default = "/dist/assets/footer-background-Acv0Z_Gm.webp";
//#endregion
//#region src/components/SiteFooter.jsx
var safeUrl = (value) => typeof value === "string" && /^(https?:\/\/|mailto:|tel:)/i.test(value.trim()) ? value.trim() : null;
var Facebook = () => /* @__PURE__ */ jsx("svg", {
	width: "21",
	height: "21",
	viewBox: "0 0 24 24",
	fill: "currentColor",
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("path", { d: "M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5C17 1.2 16 1 15 1c-3 0-5 2-5 5v3H7v4h3v9z" })
});
var Instagram = () => /* @__PURE__ */ jsxs("svg", {
	width: "21",
	height: "21",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ jsx("rect", {
			x: "3",
			y: "3",
			width: "18",
			height: "18",
			rx: "5"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "12",
			cy: "12",
			r: "4"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "17.5",
			cy: "6.5",
			r: "1",
			fill: "currentColor",
			stroke: "none"
		})
	]
});
var Youtube = () => /* @__PURE__ */ jsxs("svg", {
	width: "21",
	height: "21",
	viewBox: "0 0 24 24",
	fill: "currentColor",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ jsx("rect", {
		x: "2",
		y: "5",
		width: "20",
		height: "14",
		rx: "4"
	}), /* @__PURE__ */ jsx("path", {
		d: "m10 9 6 3-6 3z",
		fill: "#ffe7e9"
	})]
});
var columns = [
	{
		title: "Sản phẩm",
		links: [
			["Mẫu thiệp cưới", "/templates"],
			["Tính năng", "#features"],
			["Bảng giá", "#pricing"],
			["Khách hàng", "#testimonials"],
			["Câu hỏi thường gặp", "#faq"]
		]
	},
	{
		title: "Hỗ trợ",
		links: [
			["Hướng dẫn sử dụng", "#steps"],
			["Liên hệ", "#footer-contact"],
			[
				"Chính sách bảo mật",
				null,
				"privacy_url"
			],
			[
				"Điều khoản dịch vụ",
				null,
				"terms_url"
			],
			["Hướng dẫn thanh toán", "#pricing"]
		]
	},
	{
		title: "Về chúng tôi",
		links: [
			["Giới thiệu", "#whyus"],
			[
				"Blog chia sẻ",
				null,
				"blog_url"
			],
			["Câu chuyện khách hàng", "#testimonials"],
			[
				"Tuyển dụng",
				null,
				"careers_url"
			],
			[
				"Đối tác",
				null,
				"partners_url"
			]
		]
	}
];
var socials = [
	{
		name: "Facebook",
		key: "social_facebook",
		icon: Facebook
	},
	{
		name: "Instagram",
		key: "social_instagram",
		icon: Instagram
	},
	{
		name: "TikTok",
		key: "social_tiktok",
		icon: Music2
	},
	{
		name: "YouTube",
		key: "social_youtube",
		icon: Youtube
	},
	{
		name: "Zalo",
		key: "social_zalo"
	}
];
function SiteFooter({ settings = {} }) {
	const [email, setEmail] = useState("");
	const [consent, setConsent] = useState(false);
	const [busy, setBusy] = useState(false);
	const [feedback, setFeedback] = useState(null);
	const submit = async (event) => {
		event.preventDefault();
		if (busy || !consent) return;
		setBusy(true);
		setFeedback(null);
		try {
			const response = await fetch("/api/public/newsletter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({
					email: email.trim(),
					consent
				})
			});
			const data = await response.json();
			if (!response.ok || !data.success) throw new Error(data.errors?.email?.[0] || (response.status === 429 ? "Bạn đã thử nhiều lần. Vui lòng đợi một phút rồi thử lại." : data.message || "Chưa thể đăng ký. Vui lòng thử lại sau."));
			setFeedback({
				success: true,
				message: data.message
			});
			setEmail("");
			setConsent(false);
		} catch (error) {
			setFeedback({
				success: false,
				message: error instanceof SyntaxError || error instanceof TypeError ? "Không thể kết nối. Vui lòng thử lại sau." : error.message
			});
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx("footer", {
		className: "site-footer",
		style: { "--footer-artwork": `url(${footer_background_default})` },
		"aria-label": "Thông tin WeddingSaaS",
		children: /* @__PURE__ */ jsxs("div", {
			className: "site-footer__inner",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "site-footer__columns",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "site-footer__brand",
							id: "footer-contact",
							children: [
								/* @__PURE__ */ jsx("a", {
									href: "#home",
									"aria-label": "WeddingSaaS — Trang chủ",
									children: /* @__PURE__ */ jsx("img", {
										src: logo_default,
										alt: "WeddingSaaS — Thiệp cưới Online Thông Minh",
										width: "270",
										height: "85",
										loading: "lazy"
									})
								}),
								/* @__PURE__ */ jsx("p", { children: "Đồng hành cùng hàng ngàn cặp đôi tạo nên tấm thiệp cưới đẹp, tinh tế và đầy ý nghĩa trong ngày trọng đại." }),
								/* @__PURE__ */ jsx("div", {
									className: "site-footer__socials",
									children: socials.map(({ name, key, icon: Icon }) => {
										const url = safeUrl(settings[key]);
										const content = Icon ? /* @__PURE__ */ jsx(Icon, { size: 21 }) : /* @__PURE__ */ jsx("span", {
											className: "site-footer__zalo",
											children: "Zalo"
										});
										return url ? /* @__PURE__ */ jsx("a", {
											href: url,
											target: "_blank",
											rel: "noopener noreferrer",
											"aria-label": name,
											children: content
										}, key) : /* @__PURE__ */ jsx("span", {
											className: "is-unavailable",
											"aria-label": `${name} — sắp cập nhật`,
											title: `${name} — sắp cập nhật`,
											children: content
										}, key);
									})
								}),
								settings.contact_email && /* @__PURE__ */ jsxs("a", {
									className: "site-footer__contact",
									href: `mailto:${settings.contact_email}`,
									children: [/* @__PURE__ */ jsx(Mail, { size: 15 }), settings.contact_email]
								}),
								settings.contact_phone && /* @__PURE__ */ jsx("a", {
									className: "site-footer__contact",
									href: `tel:${settings.contact_phone}`,
									children: settings.contact_phone
								})
							]
						}),
						columns.map((column) => /* @__PURE__ */ jsxs("nav", {
							className: "site-footer__links",
							"aria-label": column.title,
							children: [/* @__PURE__ */ jsx("h2", { children: column.title }), /* @__PURE__ */ jsx("ul", { children: column.links.map(([label, anchor, setting]) => {
								const url = anchor || safeUrl(settings[setting]);
								return /* @__PURE__ */ jsx("li", { children: url ? /* @__PURE__ */ jsx("a", {
									href: url,
									children: label
								}) : /* @__PURE__ */ jsx("span", {
									title: "Sắp cập nhật",
									children: label
								}) }, label);
							}) })]
						}, column.title)),
						/* @__PURE__ */ jsxs("div", {
							className: "site-footer__newsletter",
							children: [
								/* @__PURE__ */ jsx("h2", { children: "Nhận thông tin mới nhất" }),
								/* @__PURE__ */ jsx("p", { children: "Đăng ký để nhận ưu đãi, mẫu thiệp mới và các tips hữu ích từ WeddingSaaS." }),
								/* @__PURE__ */ jsxs("form", {
									onSubmit: submit,
									"aria-label": "Đăng ký nhận email",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "site-footer__email",
											children: [
												/* @__PURE__ */ jsx(Mail, {
													size: 21,
													"aria-hidden": "true"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "email",
													"aria-label": "Email của bạn",
													placeholder: "Nhập email của bạn",
													autoComplete: "email",
													required: true,
													maxLength: 254,
													value: email,
													onChange: (event) => setEmail(event.target.value),
													disabled: busy
												}),
												/* @__PURE__ */ jsx("button", {
													type: "submit",
													"aria-label": "Đăng ký nhận thông tin",
													disabled: busy,
													children: busy ? /* @__PURE__ */ jsx("span", { className: "site-footer__loading" }) : /* @__PURE__ */ jsx(ArrowRight, { size: 22 })
												})
											]
										}),
										/* @__PURE__ */ jsxs("label", {
											className: "site-footer__consent",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: consent,
												onChange: (event) => setConsent(event.target.checked),
												required: true,
												disabled: busy
											}), /* @__PURE__ */ jsx("span", { children: "Tôi đồng ý nhận email từ WeddingSaaS." })]
										}),
										/* @__PURE__ */ jsx("div", {
											className: `site-footer__feedback${feedback?.success ? " is-success" : ""}`,
											role: "status",
											"aria-live": "polite",
											children: feedback?.message
										})
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "site-footer__divider",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ jsx("span", {}),
						/* @__PURE__ */ jsx(Heart, { size: 22 }),
						/* @__PURE__ */ jsx("span", {})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "site-footer__bottom",
					children: [
						/* @__PURE__ */ jsx("p", { children: "© 2026 WeddingSaaS. Tất cả quyền được bảo lưu." }),
						/* @__PURE__ */ jsxs("div", {
							className: "site-footer__payment",
							children: [
								/* @__PURE__ */ jsx(QrCode, { size: 25 }),
								/* @__PURE__ */ jsx("strong", { children: "VietQR" }),
								/* @__PURE__ */ jsx("span", { children: "Chuyển khoản ngân hàng" })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "site-footer__assurances",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 29 }), /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Bảo mật thông tin" }), /* @__PURE__ */ jsx("span", { children: "Tôn trọng quyền riêng tư" })] })] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Headphones, { size: 29 }), /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Hỗ trợ 24/7" }), /* @__PURE__ */ jsx("span", { children: "Luôn sẵn sàng giúp đỡ" })] })] })]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region images/section-07-testimonials/background.webp
var background_default$1 = "/dist/assets/background-Do5LeBWL.webp";
//#endregion
//#region src/components/TestimonialsSection.jsx
var reviews = [
	{
		id: "ngoc-anh",
		avatar: "/dist/assets/couple-01-CP-W1idA.webp",
		names: "Ngọc Anh & Hoàng Nam",
		date: "12.10.2024",
		comment: "Rất dễ sử dụng, mẫu thiệp đẹp và sang trọng. Chúng mình chỉ mất vài phút là đã có thiệp cưới ưng ý. Khách mời ai cũng khen!"
	},
	{
		id: "minh-quan",
		avatar: "/dist/assets/couple-02-s_d9NKqe.webp",
		names: "Minh Quân & Thảo Vy",
		date: "24.11.2024",
		comment: "Giao diện rất đẹp, nhiều mẫu hiện đại và dễ tùy chỉnh. Tính năng RSVP giúp chúng mình quản lý khách mời cực thuận tiện. Rất hài lòng!"
	},
	{
		id: "duc-huy",
		avatar: "/dist/assets/couple-03-Bw5K2GOv.webp",
		names: "Đức Huy & Phương Linh",
		date: "05.10.2024",
		comment: "Thiệp cưới online thật sự là giải pháp tiện lợi và tiết kiệm. Mẫu mã đa dạng, hình ảnh sắc nét, gửi cho khách chỉ trong vài giây."
	}
];
var Stars = () => /* @__PURE__ */ jsx("span", {
	className: "wedding-reviews__stars",
	role: "img",
	"aria-label": "5 trên 5 sao",
	children: Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ jsx(Star, {
		size: 17,
		fill: "currentColor",
		strokeWidth: 1
	}, index))
});
function TestimonialsSection({ onCreate }) {
	const [active, setActive] = useState(1);
	const [favorites, setFavorites] = useState([]);
	const slider = useRef(null);
	const move = (direction) => direction < 0 ? slider.current?.slidePrev() : slider.current?.slideNext();
	const slides = [...reviews, ...reviews];
	const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
	return /* @__PURE__ */ jsx("section", {
		id: "testimonials",
		className: "wedding-reviews",
		"aria-labelledby": "wedding-reviews-title",
		style: {
			"--section-artwork": `url(${background_default$1})`,
			"--section-artwork-opacity": 1
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "wedding-reviews__inner",
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "wedding-reviews__heading",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "wedding-reviews__badge",
							children: [/* @__PURE__ */ jsx(Heart, { size: 16 }), "Cảm nhận từ khách hàng"]
						}),
						/* @__PURE__ */ jsxs("h2", {
							id: "wedding-reviews-title",
							children: ["Hơn 10.000+ Cặp Đôi Đã Tin Chọn", /* @__PURE__ */ jsx("em", { children: "WeddingSaaS" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "wedding-reviews__divider",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ jsx("span", {}),
								/* @__PURE__ */ jsx(Heart, { size: 17 }),
								/* @__PURE__ */ jsx("span", {})
							]
						}),
						/* @__PURE__ */ jsxs("p", { children: [
							"Những câu chuyện hạnh phúc và cảm nhận chân thật từ các cặp đôi",
							/* @__PURE__ */ jsx("br", { className: "wedding-reviews__desktop-break" }),
							" đã sử dụng WeddingSaaS để tạo nên tấm thiệp cưới ý nghĩa."
						] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "wedding-reviews__carousel",
					"aria-roledescription": "carousel",
					"aria-label": "Cảm nhận khách hàng",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "wedding-reviews__arrow wedding-reviews__arrow--left",
							"aria-label": "Cảm nhận trước",
							onClick: () => move(-1),
							children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24 })
						}),
						/* @__PURE__ */ jsx(Swiper, {
							className: "wedding-reviews__slider",
							modules: [A11y, Keyboard],
							loop: true,
							centeredSlides: true,
							initialSlide: 1,
							slidesPerView: 1,
							spaceBetween: 18,
							speed: 500,
							grabCursor: true,
							preventClicks: true,
							preventClicksPropagation: true,
							touchStartPreventDefault: false,
							keyboard: {
								enabled: true,
								onlyInViewport: true
							},
							onSwiper: (swiper) => {
								slider.current = swiper;
							},
							onSlideChange: (swiper) => setActive(swiper.realIndex % reviews.length),
							breakpoints: { 1001: { slidesPerView: 3 } },
							a11y: {
								containerMessage: "Cảm nhận khách hàng",
								itemRoleDescriptionMessage: "Cảm nhận"
							},
							children: slides.map((review, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsxs("article", {
								className: "wedding-reviews__card",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "wedding-reviews__card-top",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: review.avatar,
												alt: "Ảnh cặp đôi minh họa",
												width: "82",
												height: "82",
												loading: "lazy"
											}),
											/* @__PURE__ */ jsx(Stars, {}),
											/* @__PURE__ */ jsx(Quote, {
												className: "wedding-reviews__quote",
												size: 38,
												fill: "currentColor",
												strokeWidth: 0,
												"aria-hidden": "true"
											})
										]
									}),
									/* @__PURE__ */ jsxs("blockquote", { children: [
										"“",
										review.comment,
										"”"
									] }),
									/* @__PURE__ */ jsxs("div", {
										className: "wedding-reviews__card-bottom",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", { children: review.names }), /* @__PURE__ */ jsx("time", {
											dateTime: review.date.split(".").reverse().join("-"),
											children: review.date
										})] }), /* @__PURE__ */ jsx("button", {
											type: "button",
											"aria-label": `${favorites.includes(review.id) ? "Bỏ yêu thích" : "Yêu thích"} cảm nhận của ${review.names}`,
											"aria-pressed": favorites.includes(review.id),
											onClick: () => toggleFavorite(review.id),
											children: /* @__PURE__ */ jsx(Heart, {
												size: 20,
												fill: favorites.includes(review.id) ? "currentColor" : "none"
											})
										})]
									})
								]
							}) }, `${review.id}-${index}`))
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "wedding-reviews__arrow wedding-reviews__arrow--right",
							"aria-label": "Cảm nhận tiếp theo",
							onClick: () => move(1),
							children: /* @__PURE__ */ jsx(ChevronRight, { size: 24 })
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "wedding-reviews__dots",
					"aria-label": "Chọn cảm nhận",
					children: reviews.map((review, index) => /* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": `Xem cảm nhận của ${review.names}`,
						"aria-pressed": active === index,
						className: active === index ? "is-active" : "",
						onClick: () => slider.current?.slideToLoop(index)
					}, review.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "wedding-reviews__action",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: onCreate,
						children: ["Tham gia cùng hàng ngàn cặp đôi", /* @__PURE__ */ jsx(ArrowRight, { size: 19 })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "wedding-reviews__proof",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "wedding-reviews__avatars",
								"aria-hidden": "true",
								children: reviews.map((review) => /* @__PURE__ */ jsx("img", {
									src: review.avatar,
									alt: "",
									width: "32",
									height: "32",
									loading: "lazy"
								}, review.id))
							}),
							/* @__PURE__ */ jsx("span", { children: "10.000+ cặp đôi đã tin chọn" }),
							/* @__PURE__ */ jsx(Stars, {})
						]
					})]
				})
			]
		})
	});
}
//#endregion
//#region images/section-09-faq/background.webp
var background_default = "/dist/assets/background-DGy6kOgN.webp";
//#endregion
//#region images/section-09-faq/couple.webp
var couple_default = "/dist/assets/couple-vTuvOBIl.webp";
//#endregion
//#region images/shared/florals/shared-floral-branch-left.webp
var shared_floral_branch_left_default = "/dist/assets/shared-floral-branch-left-CZntlqqY.webp";
//#endregion
//#region src/components/FaqSection.jsx
var questions = [
	{
		question: "Tạo thiệp cưới online có mất phí không?",
		answer: "Bạn có thể tạo và xem thử thiệp miễn phí. Các gói trả phí bổ sung tính năng như đường dẫn riêng, RSVP và mã QR mừng cưới. Xem bảng giá để chọn gói phù hợp với nhu cầu của bạn."
	},
	{
		question: "Tôi có thể tùy chỉnh nội dung và hình ảnh không?",
		answer: "Có. Bạn có thể chỉnh tên cô dâu, chú rể, thời gian, địa điểm, nội dung lời mời và hình ảnh. Trình chỉnh sửa cũng hỗ trợ thay đổi màu sắc, phông chữ và nhạc nền theo mẫu thiệp bạn chọn."
	},
	{
		question: "Sau khi tạo xong, tôi gửi thiệp cho khách bằng cách nào?",
		answer: "Sau khi lưu thiệp, bạn có thể sao chép đường dẫn và gửi cho khách qua Zalo, Facebook hoặc các ứng dụng nhắn tin. Khách mở đường dẫn để xem thiệp trực tiếp trên trình duyệt."
	},
	{
		question: "Thiệp cưới có hiển thị tốt trên điện thoại không?",
		answer: "Thiệp được thiết kế để sử dụng trên điện thoại và máy tính. Bạn có thể xem trước trong trình chỉnh sửa để kiểm tra hình ảnh, nội dung và bố cục trước khi gửi lời mời."
	},
	{
		question: "Dữ liệu thiệp cưới của tôi có được bảo mật không?",
		answer: "Tài khoản giúp bạn quản lý các thiệp đã lưu. Thiệp đã chia sẻ có thể được xem bởi người có đường dẫn, vì vậy bạn hãy chọn nội dung phù hợp để gửi tới khách mời. Nếu cần hỗ trợ về dữ liệu tài khoản, hãy liên hệ đội ngũ WeddingSaaS."
	}
];
function FaqSection({ settings = {} }) {
	const [open, setOpen] = useState(0);
	const zalo = typeof settings.social_zalo === "string" && /^https?:\/\//i.test(settings.social_zalo.trim()) ? settings.social_zalo.trim() : null;
	const contact = zalo || (settings.contact_email ? `mailto:${settings.contact_email}` : settings.contact_phone ? `tel:${settings.contact_phone}` : "#footer-contact");
	return /* @__PURE__ */ jsx("section", {
		id: "faq",
		className: "wedding-faq",
		"aria-labelledby": "wedding-faq-title",
		style: {
			"--section-artwork": `url(${background_default})`,
			"--section-artwork-opacity": 1
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "wedding-faq__inner",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "wedding-faq__content",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "wedding-faq__heading",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "wedding-faq__badge",
							children: [/* @__PURE__ */ jsx(MessageCircle, { size: 16 }), "Câu hỏi thường gặp"]
						}),
						/* @__PURE__ */ jsxs("h2", {
							id: "wedding-faq-title",
							children: ["Giải Đáp Thắc Mắc", /* @__PURE__ */ jsx("em", { children: "Về WeddingSaaS" })]
						}),
						/* @__PURE__ */ jsx("p", { children: "Tổng hợp những câu hỏi phổ biến nhất để giúp bạn hiểu rõ hơn và dễ dàng bắt đầu tạo thiệp cưới online." })
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "wedding-faq__questions",
					children: questions.map(({ question, answer }, index) => /* @__PURE__ */ jsxs("article", {
						className: `wedding-faq__item${open === index ? " is-open" : ""}`,
						children: [/* @__PURE__ */ jsx("h3", { children: /* @__PURE__ */ jsxs("button", {
							type: "button",
							id: `faq-question-${index}`,
							"aria-expanded": open === index,
							"aria-controls": `faq-answer-${index}`,
							onClick: () => setOpen((current) => current === index ? null : index),
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "wedding-faq__number",
									children: ["0", index + 1]
								}),
								/* @__PURE__ */ jsx("span", { children: question }),
								/* @__PURE__ */ jsx("span", {
									className: "wedding-faq__chevron",
									children: /* @__PURE__ */ jsx(ChevronDown, { size: 21 })
								})
							]
						}) }), /* @__PURE__ */ jsx("div", {
							id: `faq-answer-${index}`,
							role: "region",
							"aria-labelledby": `faq-question-${index}`,
							"aria-hidden": open !== index,
							inert: open !== index,
							className: "wedding-faq__answer",
							children: /* @__PURE__ */ jsx("div", {
								className: "wedding-faq__answer-clip",
								children: /* @__PURE__ */ jsx("div", {
									className: "wedding-faq__answer-content",
									children: /* @__PURE__ */ jsxs("p", { children: [answer, index === 0 && /* @__PURE__ */ jsxs(Fragment, { children: [" ", /* @__PURE__ */ jsx("a", {
										href: "#pricing",
										children: "Xem bảng giá →"
									})] })] })
								})
							})
						})]
					}, question))
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "wedding-faq__visual",
				children: [/* @__PURE__ */ jsx("img", {
					className: "wedding-faq__couple",
					src: couple_default,
					alt: "Cặp đôi trong trang phục cưới cùng bó hoa hồng pastel",
					width: "1206",
					height: "1305",
					loading: "lazy"
				}), /* @__PURE__ */ jsxs("aside", {
					className: "wedding-faq__support",
					"aria-label": "Liên hệ hỗ trợ",
					children: [
						/* @__PURE__ */ jsx("img", {
							className: "wedding-faq__flowers wedding-faq__flowers--left",
							src: shared_floral_branch_left_default,
							alt: "",
							"aria-hidden": "true",
							loading: "lazy"
						}),
						/* @__PURE__ */ jsx("img", {
							className: "wedding-faq__flowers wedding-faq__flowers--right",
							src: shared_floral_branch_left_default,
							alt: "",
							"aria-hidden": "true",
							loading: "lazy"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "wedding-faq__mail",
							"aria-hidden": "true",
							children: /* @__PURE__ */ jsx(Mail, { size: 30 })
						}),
						/* @__PURE__ */ jsx("h3", { children: "Vẫn còn thắc mắc?" }),
						/* @__PURE__ */ jsxs("p", { children: [
							"Đội ngũ WeddingSaaS luôn sẵn sàng",
							/* @__PURE__ */ jsx("br", {}),
							"hỗ trợ bạn 24/7."
						] }),
						/* @__PURE__ */ jsxs("a", {
							href: contact,
							...zalo ? {
								target: "_blank",
								rel: "noopener noreferrer"
							} : {},
							children: [
								/* @__PURE__ */ jsx(Users, { size: 17 }),
								"Liên hệ với chúng tôi",
								/* @__PURE__ */ jsx(ArrowRight, { size: 18 })
							]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
//#region src/components/MobileLandingMenu.jsx
var landingLinks = [
	{
		id: "home",
		label: "Trang chủ"
	},
	{
		id: "templates",
		label: "Mẫu thiệp"
	},
	{
		id: "features",
		label: "Tính năng"
	},
	{
		id: "pricing",
		label: "Bảng giá"
	},
	{
		id: "steps",
		label: "Hướng dẫn"
	},
	{
		id: "contact",
		label: "Liên hệ"
	}
];
function MobileLandingMenu({ isOpen, onClose, activeNav, onNavigate, onCreate, onLogin, user, onMyCards, onAdmin, onLogout }) {
	const panel = useRef(null);
	useEffect(() => {
		if (!isOpen) return;
		const previousFocus = document.activeElement;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const frame = requestAnimationFrame(() => panel.current?.querySelector("button")?.focus({ preventScroll: true }));
		const closeOnDesktop = () => {
			if (window.innerWidth > 760) onClose();
		};
		const keydown = (event) => {
			if (event.key === "Escape") onClose();
			if (event.key !== "Tab") return;
			const items = panel.current?.querySelectorAll("button, a[href]");
			if (!items?.length) return;
			if (event.shiftKey && document.activeElement === items[0]) {
				event.preventDefault();
				items[items.length - 1].focus();
			}
			if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
				event.preventDefault();
				items[0].focus();
			}
		};
		window.addEventListener("resize", closeOnDesktop);
		document.addEventListener("keydown", keydown);
		return () => {
			cancelAnimationFrame(frame);
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("resize", closeOnDesktop);
			document.removeEventListener("keydown", keydown);
			previousFocus?.focus({ preventScroll: true });
		};
	}, [isOpen, onClose]);
	const act = (callback) => {
		onClose();
		callback?.();
	};
	if (typeof document === "undefined") return null;
	return createPortal(/* @__PURE__ */ jsx("div", {
		className: `landing-mobile-menu${isOpen ? " is-open" : ""}`,
		"aria-hidden": !isOpen,
		inert: !isOpen ? true : void 0,
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("aside", {
			id: "landing-mobile-menu",
			ref: panel,
			className: "landing-mobile-menu__panel",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Menu điều hướng",
			onClick: (event) => event.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "landing-mobile-menu__top",
					children: [/* @__PURE__ */ jsx("img", {
						src: logo_default,
						alt: "WeddingSaaS"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Đóng menu",
						children: /* @__PURE__ */ jsx(X, { size: 22 })
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "landing-mobile-menu__intro",
					children: "Thiệp cưới cho ngày trọng đại"
				}),
				/* @__PURE__ */ jsx("nav", {
					"aria-label": "Điều hướng mobile",
					children: landingLinks.map((link) => /* @__PURE__ */ jsxs("a", {
						href: link.id === "templates" ? "/templates" : `#${link.id}`,
						"aria-current": activeNav === link.id ? "page" : void 0,
						onClick: (event) => {
							event.preventDefault();
							act(() => onNavigate(link.id));
						},
						children: [link.label, /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
					}, link.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "landing-mobile-menu__actions",
					children: [user ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs("p", {
							className: "landing-mobile-menu__user",
							children: ["Xin chào, ", user.name]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => act(user.role === "admin" ? onAdmin : onMyCards),
							children: [user.role === "admin" ? /* @__PURE__ */ jsx(Shield, { size: 18 }) : /* @__PURE__ */ jsx(FolderHeart, { size: 18 }), user.role === "admin" ? "Trang quản trị" : "Thiệp của tôi"]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => act(onLogout),
							children: [/* @__PURE__ */ jsx(LogOut, { size: 18 }), "Đăng xuất"]
						})
					] }) : /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => act(onLogin),
						children: "Đăng nhập / Đăng ký"
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "landing-mobile-menu__create",
						onClick: () => act(onCreate),
						children: [user?.role === "admin" ? "Trang quản trị" : "Tạo thiệp ngay", /* @__PURE__ */ jsx(ArrowRight, { size: 18 })]
					})]
				})
			]
		})
	}), document.body);
}
//#endregion
//#region images/section-05-features/features-product.webp
var features_product_default = "/dist/assets/features-product-DI6YvApN.webp";
//#endregion
//#region images/section-05-features/features-sprig.webp
var features_sprig_default = "/dist/assets/features-sprig-Do7G10vl.webp";
//#endregion
//#region images/section-05-features/features-background-no-arch.webp
var features_background_no_arch_default = "/dist/assets/features-background-no-arch-DDECufsW.webp";
//#endregion
//#region src/components/FeaturesSection.jsx
var features = [
	{
		icon: Brush,
		title: "Thiết kế theo ý bạn",
		detail: "Đa dạng mẫu thiệp đẹp, từ phong cách hiện đại đến truyền thống."
	},
	{
		icon: Users,
		title: "Quản lý khách mời",
		detail: "Tạo danh sách khách mời, gửi thiệp và theo dõi phản hồi RSVP."
	},
	{
		icon: Mail,
		title: "Gửi lời mời online",
		detail: "Chia sẻ dễ dàng qua link, QR code hoặc email, tiện lợi và nhanh chóng."
	},
	{
		icon: ChartColumn,
		title: "Theo dõi phản hồi",
		detail: "Biết khách mời nào đã xác nhận tham dự để chuẩn bị chu đáo."
	},
	{
		icon: Settings,
		title: "Tùy chỉnh linh hoạt",
		detail: "Dễ dàng thay đổi màu sắc, font chữ, hình ảnh theo phong cách của bạn."
	},
	{
		icon: ShieldCheck,
		title: "Riêng tư & an toàn",
		detail: "Chủ động quản lý thông tin thiệp và danh sách khách mời của bạn."
	}
];
function FeaturesSection({ onCreate }) {
	return /* @__PURE__ */ jsx("section", {
		id: "features",
		className: "wedding-features",
		"aria-labelledby": "wedding-features-title",
		style: { "--features-artwork": `url(${features_background_no_arch_default})` },
		children: /* @__PURE__ */ jsxs("div", {
			className: "wedding-features__inner",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "wedding-features__content",
					children: [/* @__PURE__ */ jsxs("header", {
						className: "wedding-features__heading",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "wedding-features__badge",
								children: [/* @__PURE__ */ jsx(Sparkles, { size: 18 }), "Tính năng nổi bật"]
							}),
							/* @__PURE__ */ jsxs("h2", {
								id: "wedding-features-title",
								children: ["Trải Nghiệm Thiệp Cưới", /* @__PURE__ */ jsx("em", { children: "Điện Tử Thông Minh" })]
							}),
							/* @__PURE__ */ jsx("p", { children: "Từ thiết kế đến gửi lời mời, mọi chi tiết đều được tối ưu để giúp bạn chuẩn bị ngày cưới dễ dàng, nhanh chóng và trọn vẹn hơn." })
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "wedding-features__grid",
						children: features.map(({ icon: Icon, title, detail }, index) => /* @__PURE__ */ jsxs("article", {
							className: "wedding-features__card",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "wedding-features__ornament",
									children: /* @__PURE__ */ jsx("span", {
										className: "wedding-features__icon",
										children: /* @__PURE__ */ jsx(Icon, {
											size: 30,
											strokeWidth: 1.6
										})
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "wedding-features__card-copy",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "wedding-features__number",
											children: String(index + 1).padStart(2, "0")
										}),
										/* @__PURE__ */ jsx("h3", { children: title }),
										/* @__PURE__ */ jsx("p", { children: detail })
									]
								}),
								/* @__PURE__ */ jsx("img", {
									className: "wedding-features__flowers",
									src: features_sprig_default,
									alt: "",
									"aria-hidden": "true",
									loading: "lazy"
								})
							]
						}, title))
					})]
				}),
				/* @__PURE__ */ jsx("figure", {
					className: "wedding-features__visual",
					children: /* @__PURE__ */ jsx("img", {
						src: features_product_default,
						alt: "Điện thoại hiển thị thiệp cưới Minh Quân và Thảo Vy bên thiệp giấy và hoa hồng",
						loading: "lazy"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "wedding-features__footer",
					children: [/* @__PURE__ */ jsxs("button", {
						className: "wedding-features__create",
						type: "button",
						onClick: onCreate,
						children: ["Tạo Thiệp Của Bạn Ngay", /* @__PURE__ */ jsx(ArrowRight, { size: 18 })]
					}), /* @__PURE__ */ jsxs("ul", {
						className: "wedding-features__benefits",
						"aria-label": "Tiện ích trải nghiệm",
						children: [
							/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Gift, { size: 23 }), "Miễn phí trải nghiệm"] }),
							/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Zap, { size: 23 }), "Thiết kế nhanh chóng"] }),
							/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Headphones, { size: 23 }), "Hỗ trợ tận tâm"] })
						]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/FeatureText.jsx
function FeatureText({ text }) {
	const document = new DOMParser().parseFromString(String(text), "text/html");
	const allowed = /* @__PURE__ */ new Set([
		"strong",
		"b",
		"em",
		"i",
		"u",
		"s",
		"br"
	]);
	const render = (node, key) => {
		if (node.nodeType === 3) return node.textContent;
		const tag = node.nodeName.toLowerCase();
		if ([
			"script",
			"style",
			"iframe",
			"object"
		].includes(tag)) return null;
		const children = [...node.childNodes].map((child, index) => render(child, `${key}-${index}`));
		if (!allowed.has(tag)) return children;
		return createElement(tag, { key }, tag === "br" ? void 0 : children);
	};
	return [...document.body.childNodes].map((node, index) => render(node, index));
}
//#endregion
//#region images/section-06-pricing/pricing-ornaments.webp
var pricing_ornaments_default = "/dist/assets/pricing-ornaments-8i9T6WsH.webp";
//#endregion
//#region src/components/PricingSection.jsx
var defaultPlans = [
	{
		id: "trial",
		code: "trial",
		name: "Gói Thử Nghiệm",
		subtitle: "Trải nghiệm miễn phí",
		price: "0đ",
		rawPrice: 0,
		description: "Dành cho bạn mới bắt đầu",
		action: "Tạo Thiệp Miễn Phí",
		is_popular: false,
		features: [
			["Xem & trải nghiệm mẫu thiệp", true],
			["Tự do tạo thiệp với mẫu cơ bản", true],
			["Xuất file HTML để chia sẻ", true],
			["Có logo WeddingSaaS", true],
			["Tùy chỉnh tên miền riêng", false],
			["Không hỗ trợ quản lý khách mời", false]
		]
	},
	{
		id: "basic",
		code: "basic",
		name: "Gói Cơ Bản",
		subtitle: "Phù hợp cho cá nhân",
		price: "49.000đ",
		rawPrice: 49e3,
		description: "Giải pháp tiết kiệm, đầy đủ tính năng cơ bản",
		action: "Chọn Gói Cơ Bản",
		is_popular: false,
		features: [
			["Sử dụng toàn bộ mẫu thiệp đẹp", true],
			["Tùy chỉnh nội dung, hình ảnh, màu sắc", true],
			["Xuất link chia sẻ không logo", true],
			["Tùy chỉnh tên miền phụ (vd: tenban.weddingsaas.vn)", true],
			["Nhạc nền lãng mạn", true],
			["Thông báo khi có khách mời RSVP", true],
			["Quản lý khách mời nâng cao", false],
			["Không hỗ trợ mã QR tùy chỉnh", false]
		]
	},
	{
		id: "pro",
		code: "pro",
		name: "Gói Pro Nổi Bật",
		subtitle: "Lựa chọn hoàn hảo cho đám cưới",
		price: "99.000đ",
		rawPrice: 99e3,
		description: "Đầy đủ tính năng cao cấp, dễ dàng quản lý",
		action: "Chọn Gói Pro Ngay",
		is_popular: true,
		features: [
			["Sử dụng toàn bộ mẫu thiệp cao cấp", true],
			["Tùy chỉnh giao diện chuyên nghiệp", true],
			["Tên miền riêng (vd: tenban.com)", true],
			["Nhạc nền theo sở thích", true],
			["Quản lý khách mời thông minh", true],
			["Gửi thông báo tự động (Email/SMS/Telegram)", true],
			["Mã QR mừng cưới & chỉ đường", true],
			["Thống kê lượt xem, xác nhận tham dự", true],
			["Hỗ trợ 24/7 qua chat", true]
		]
	},
	{
		id: "vip",
		code: "vip",
		name: "Gói VIP Đặc Biệt",
		subtitle: "Dành cho tiệc cưới lớn & cao cấp",
		price: "199.000đ",
		rawPrice: 199e3,
		description: "Trải nghiệm trọn vẹn, chuyên nghiệp và khác biệt",
		action: "Đăng Ký Gói VIP",
		is_popular: false,
		features: [
			["Tất cả tính năng của Gói Pro", true],
			["Thiết kế giao diện theo yêu cầu", true],
			["Tên miền riêng .com/.vn", true],
			["Mời khách qua Email/SMS/Telegram", true],
			["Tích hợp bản đồ, chỉ đường, lịch trình", true],
			["Mã QR mừng cưới tùy chỉnh", true],
			["Thống kê chi tiết & xuất danh sách khách mời", true],
			["Hỗ trợ kỹ thuật 1:1 trong suốt thời gian sử dụng", true],
			["Tư vấn thiết kế miễn phí", true]
		]
	}
];
var parseFeatures = (features) => {
	if (!features || !Array.isArray(features)) return [];
	return features.map((item) => {
		if (Array.isArray(item)) return item;
		if (typeof item === "object" && item !== null) return [item.label, item.included !== false];
		const str = String(item).trim();
		if (str.startsWith("- ") || str.startsWith("x ") || str.startsWith("X ")) return [str.slice(2).trim(), false];
		if (str.startsWith("+ ")) return [str.slice(2).trim(), true];
		return [str, true];
	});
};
function PricingSection({ onGoToEditor }) {
	const [plans, setPlans] = useState(defaultPlans);
	useEffect(() => {
		fetch("/api/public/plans").then((res) => res.json()).then((data) => {
			if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
				const formatted = data.plans.map((p) => ({
					id: p.code || String(p.id),
					code: p.code,
					name: p.name,
					subtitle: p.subtitle || "",
					price: p.price > 0 ? `${Number(p.price).toLocaleString("vi-VN")}đ` : "0đ",
					rawPrice: p.price,
					period: p.period || (p.price > 0 ? "/thiệp" : ""),
					description: p.description || "",
					action: p.action || (p.price > 0 ? "Chọn Gói Ngay" : "Tạo Thiệp Miễn Phí"),
					is_popular: Boolean(p.is_popular),
					features: parseFeatures(p.features)
				}));
				setPlans(formatted);
			}
		}).catch(() => {});
	}, []);
	return /* @__PURE__ */ jsx("section", {
		id: "pricing",
		className: "wedding-pricing",
		"aria-labelledby": "wedding-pricing-title",
		children: /* @__PURE__ */ jsxs("div", {
			className: "wedding-pricing__inner",
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "wedding-pricing__heading",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "wedding-pricing__eyebrow",
							children: "BẢNG GIÁ DỊCH VỤ"
						}),
						/* @__PURE__ */ jsxs("h2", {
							id: "wedding-pricing-title",
							children: ["Chọn Gói Phù Hợp Với ", /* @__PURE__ */ jsx("em", { children: "Ngày Trọng Đại" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "wedding-pricing__divider",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ jsx("span", {}),
								/* @__PURE__ */ jsx(Heart, {
									size: 12,
									fill: "currentColor"
								}),
								/* @__PURE__ */ jsx("span", {})
							]
						}),
						/* @__PURE__ */ jsx("p", { children: "Tạo thiệp cưới online đẹp mắt, tiện lợi với chi phí hợp lý. Nhiều lựa chọn phù hợp cho mọi nhu cầu." })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "wedding-pricing__grid",
					children: plans.map((plan, index) => /* @__PURE__ */ jsxs("article", {
						className: `wedding-pricing__card wedding-pricing__card--${plan.id}`,
						"aria-labelledby": `pricing-${plan.id}`,
						children: [
							plan.is_popular && /* @__PURE__ */ jsxs("span", {
								className: "wedding-pricing__popular",
								children: [/* @__PURE__ */ jsx(Crown, { size: 17 }), "PHỔ BIẾN NHẤT"]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "wedding-pricing__ornament",
								"aria-hidden": "true",
								style: {
									backgroundImage: `url(${pricing_ornaments_default})`,
									backgroundPosition: `${index * 100 / Math.max(plans.length - 1, 1)}% center`
								}
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "wedding-pricing__intro",
								children: [/* @__PURE__ */ jsx("h3", {
									id: `pricing-${plan.id}`,
									children: plan.name
								}), plan.subtitle && /* @__PURE__ */ jsx("p", {
									className: "wedding-pricing__subtitle",
									children: plan.subtitle
								})]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "wedding-pricing__price",
								children: [plan.price, plan.rawPrice > 0 && /* @__PURE__ */ jsx("span", { children: plan.period || "/thiệp" })]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "wedding-pricing__description",
								children: plan.description
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "wedding-pricing__features",
								children: plan.features.map(([label, included]) => /* @__PURE__ */ jsxs("li", {
									className: included ? "" : "is-unavailable",
									children: [included ? /* @__PURE__ */ jsx(Check, {
										size: 19,
										strokeWidth: 2.8,
										"aria-hidden": "true"
									}) : /* @__PURE__ */ jsx(X, {
										size: 19,
										strokeWidth: 2.8,
										"aria-hidden": "true"
									}), /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(FeatureText, { text: label }) })]
								}, label))
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "wedding-pricing__choose",
								onClick: () => plan.rawPrice === 0 ? onGoToEditor() : onGoToEditor(null, plan.id),
								children: [plan.action, /* @__PURE__ */ jsx(ArrowRight, { size: 18 })]
							})
						]
					}, plan.id))
				}),
				/* @__PURE__ */ jsxs("ul", {
					className: "wedding-pricing__benefits",
					"aria-label": "Tiện ích dịch vụ",
					children: [
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Gift, {}), /* @__PURE__ */ jsxs("span", { children: [
							"Nhiều mẫu thiệp đẹp,",
							/* @__PURE__ */ jsx("br", {}),
							"cập nhật liên tục"
						] })] }),
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Settings, {}), /* @__PURE__ */ jsxs("span", { children: [
							"Dễ dàng tùy chỉnh,",
							/* @__PURE__ */ jsx("br", {}),
							"không cần biết lập trình"
						] })] }),
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(ShieldCheck, {}), /* @__PURE__ */ jsxs("span", { children: [
							"Bảo mật thông tin",
							/* @__PURE__ */ jsx("br", {}),
							"của bạn và khách mời"
						] })] }),
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Headphones, {}), /* @__PURE__ */ jsxs("span", { children: [
							"Hỗ trợ 24/7",
							/* @__PURE__ */ jsx("br", {}),
							"luôn đồng hành cùng bạn"
						] })] })
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/useLandingReveal.js
var selectors = [
	".landing-hero__heading",
	".landing-hero__visual",
	".landing-hero__description",
	".landing-hero__actions",
	".landing-hero__benefits",
	".landing-hero__trust",
	".why-us__heading",
	".why-us__visual",
	".why-us__feature",
	".why-us__card",
	".template-gallery__heading",
	".template-gallery__filters",
	".template-gallery__carousel",
	".wedding-steps__heading",
	".wedding-steps__card",
	".wedding-steps__step",
	".wedding-features__heading",
	".wedding-features__visual",
	".wedding-features__card",
	".wedding-pricing__heading",
	".wedding-pricing__card",
	".wedding-pricing__benefits",
	".wedding-reviews__heading",
	".wedding-reviews__carousel",
	".wedding-reviews__action",
	".wedding-faq__heading",
	".wedding-faq__item",
	".wedding-faq__visual",
	".landing-final-cta",
	".landing-final-cta__inner",
	".site-footer__brand",
	".site-footer__links",
	".site-footer__newsletter"
].join(",");
function useLandingReveal() {
	useEffect(() => {
		const root = document.querySelector(".landing-page");
		if (!root || !window.IntersectionObserver) return;
		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const elements = [...root.querySelectorAll(selectors)];
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(({ target, isIntersecting }) => {
				if (!isIntersecting) return;
				target.classList.add("landing-reveal--visible");
				observer.unobserve(target);
			});
		}, {
			threshold: .05,
			rootMargin: "0px 0px -30px 0px"
		});
		elements.forEach((element) => {
			const siblings = [...element.parentElement.children].filter((child) => child.matches(selectors));
			element.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(element), 5) * 85}ms`);
			element.classList.add("landing-reveal");
			if (motion.matches) element.classList.add("landing-reveal--visible");
			else observer.observe(element);
		});
		const showAll = () => {
			if (!motion.matches) return;
			observer.disconnect();
			elements.forEach((element) => element.classList.add("landing-reveal--visible"));
		};
		const revealFocused = (event) => {
			event.target.closest(".landing-reveal")?.classList.add("landing-reveal--visible");
		};
		motion.addEventListener("change", showAll);
		root.addEventListener("focusin", revealFocused);
		return () => {
			observer.disconnect();
			motion.removeEventListener("change", showAll);
			root.removeEventListener("focusin", revealFocused);
			elements.forEach((element) => {
				element.classList.remove("landing-reveal", "landing-reveal--visible");
				element.style.removeProperty("--reveal-delay");
			});
		};
	}, []);
}
//#endregion
//#region images/section-01-hero/hero-why-us-continuous.webp
var hero_why_us_continuous_default = "/dist/assets/hero-why-us-continuous-D3q0zlDn.webp";
//#endregion
//#region src/components/LandingPage.jsx
function LandingPage({ onGoToEditor, onOpenAuthModal, user, onLogout, onOpenMyCards, onOpenAdmin, onOpenPurchase, publicSettings = {} }) {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	useLandingReveal();
	const [activeNav, setActiveNav] = useState("home");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
	const createCard = () => user?.role === "admin" ? onOpenAdmin?.() : onGoToEditor();
	const handleNavClick = (id) => {
		if (id === "templates") {
			onOpenMyCards("templates");
			return;
		}
		setActiveNav(id);
		const element = document.getElementById(id);
		if (element) element.scrollIntoView({ behavior: "smooth" });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `landing-page${user ? " has-bottom-nav" : ""}`,
		style: {
			width: "100%",
			minHeight: "100vh",
			backgroundColor: "var(--landing-background)",
			color: "#4F3033",
			fontFamily: "var(--font-sans)",
			position: "relative",
			overflowX: "hidden"
		},
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        @keyframes floatPetal {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wedding-fullpage-swiper {
          width: 100%;
          height: 100vh;
        }

        /* Apple Creative Depth Transition Easing */
        .wedding-fullpage-swiper .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1) !important;
        }

        .wedding-fullpage-swiper .swiper-slide {
          height: 100vh !important;
          width: 100% !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          position: relative;
          box-sizing: border-box;
          padding-top: 0px;
          overflow: hidden;
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
        }

        .wedding-fullpage-swiper .swiper-slide-active > div {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Custom Vertical Pagination Dots */
        .wedding-fullpage-swiper .swiper-pagination {
          right: 22px !important;
          z-index: 90 !important;
        }

        .wedding-fullpage-swiper .swiper-pagination-bullet {
          background: #D95B70 !important;
          opacity: 0.3 !important;
          width: 10px !important;
          height: 10px !important;
          margin: 10px 0 !important;
          transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1) !important;
          cursor: pointer !important;
        }

        .wedding-fullpage-swiper .swiper-pagination-bullet-active {
          background: #F04468 !important;
          opacity: 1 !important;
          height: 28px !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 14px rgba(240, 68, 104, 0.45) !important;
        }

        /* Hero Button Design System */
        .hero-btn-primary {
          min-height: 56px;
          padding: 0 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 16px;
          background: linear-gradient(
            90deg,
            #f95b79 0%,
            #f04468 52%,
            #e82f59 100%
          );
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          box-shadow:
            0 12px 28px rgba(240, 68, 104, 0.24),
            0 4px 10px rgba(220, 54, 89, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
        }

        .hero-btn-primary:hover {
          background: linear-gradient(
            90deg,
            #ff6b89 0%,
            #f7446b 50%,
            #eb2853 100%
          );
          border-color: rgba(255, 255, 255, 0.65);
          box-shadow:
            0 0 24px rgba(240, 68, 104, 0.55),
            0 16px 36px rgba(240, 68, 104, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .hero-btn-primary:active {
          transform: scale(0.98);
          box-shadow:
            0 7px 16px rgba(240, 68, 104, 0.20),
            inset 0 2px 4px rgba(120, 20, 45, 0.10);
        }

        .hero-btn-secondary {
          min-height: 56px;
          padding: 0 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(240, 68, 104, 0.32);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #f04468;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          box-shadow:
            0 8px 20px rgba(102, 61, 67, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
        }

        .hero-btn-secondary:hover {
          background: #ffffff;
          border-color: #f04468;
          color: #e82f59;
          box-shadow:
            0 0 22px rgba(240, 68, 104, 0.38),
            0 12px 30px rgba(240, 68, 104, 0.22),
            inset 0 1px 0 #ffffff;
        }

        .hero-btn-secondary:active {
          transform: scale(0.98);
        }

        .hero-feature-icon-box {
          transition: all 0.3s ease !important;
        }
        .hero-feature-icon-box:hover {
          transform: translateY(-2px) scale(1.06) !important;
          border-color: #F04468 !important;
          box-shadow: 0 8px 22px rgba(240, 68, 104, 0.22) !important;
        }
      ` }),
			/* @__PURE__ */ jsx("header", {
				className: "landing-header",
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "80px",
					zIndex: 1e3,
					backgroundColor: "transparent",
					borderBottom: "none",
					boxShadow: "none",
					display: "flex",
					alignItems: "center"
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						width: "100%",
						maxWidth: "1600px",
						margin: "0 auto",
						padding: "0 32px",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						boxSizing: "border-box"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "landing-header__brand",
							style: {
								display: "flex",
								alignItems: "center",
								cursor: "pointer"
							},
							onClick: () => handleNavClick("home"),
							children: /* @__PURE__ */ jsx("img", {
								src: logo_default,
								alt: "WeddingSaaS - Thiệp cưới Online Thông Minh",
								style: {
									height: "78px",
									width: "auto",
									objectFit: "contain"
								}
							})
						}),
						/* @__PURE__ */ jsx("nav", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "24px"
							},
							className: "landing-header__nav",
							children: landingLinks.map((item) => /* @__PURE__ */ jsxs("a", {
								href: item.id === "templates" ? "/templates" : `#${item.id}`,
								onClick: (e) => {
									e.preventDefault();
									handleNavClick(item.id);
								},
								style: {
									position: "relative",
									color: activeNav === item.id ? "#F04468" : "#4F3033",
									fontSize: "18px",
									fontWeight: activeNav === item.id ? "700" : "600",
									textDecoration: "none",
									padding: "6px 0",
									transition: "all 0.25s ease",
									cursor: "pointer",
									display: "inline-flex",
									flexDirection: "column",
									alignItems: "center"
								},
								children: [item.label, activeNav === item.id && /* @__PURE__ */ jsx("span", { style: {
									position: "absolute",
									bottom: "-4px",
									width: "22px",
									height: "3px",
									backgroundColor: "#F04468",
									borderRadius: "3px",
									boxShadow: "0 2px 6px rgba(240, 68, 104, 0.4)"
								} })]
							}, item.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "landing-header__actions",
							style: {
								display: "flex",
								alignItems: "center",
								gap: "14px"
							},
							children: [
								user ? /* @__PURE__ */ jsxs("div", {
									className: "landing-header__account",
									style: { position: "relative" },
									children: [/* @__PURE__ */ jsxs("button", {
										onClick: () => setIsUserMenuOpen((prev) => !prev),
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px",
											backgroundColor: "#FFF0F1",
											padding: "8px 18px",
											borderRadius: "24px",
											border: "1px solid rgba(217, 91, 112, 0.2)",
											color: "#F04468",
											cursor: "pointer",
											fontWeight: "700",
											fontSize: "13px"
										},
										children: [/* @__PURE__ */ jsx("span", {
											style: {
												maxWidth: "130px",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap"
											},
											children: user.name
										}), /* @__PURE__ */ jsx(ChevronDown, {
											size: 14,
											color: "#F04468",
											style: {
												transform: isUserMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
												transition: "transform 0.2s"
											}
										})]
									}), isUserMenuOpen && /* @__PURE__ */ jsxs("div", {
										style: {
											position: "absolute",
											top: "calc(100% + 8px)",
											right: 0,
											width: "210px",
											backgroundColor: "#ffffff",
											border: "1px solid rgba(217, 91, 112, 0.15)",
											borderRadius: "16px",
											padding: "8px",
											boxShadow: "0 14px 40px rgba(102, 61, 67, 0.12)",
											zIndex: 100,
											display: "flex",
											flexDirection: "column",
											gap: "4px"
										},
										children: [
											/* @__PURE__ */ jsxs("div", {
												style: {
													padding: "8px 12px",
													borderBottom: "1px solid #f1f5f9",
													marginBottom: "4px"
												},
												children: [/* @__PURE__ */ jsx("div", {
													style: {
														fontSize: "13px",
														fontWeight: "700",
														color: "#4F3033"
													},
													children: user.name
												}), /* @__PURE__ */ jsx("div", {
													style: {
														fontSize: "11px",
														color: "#765B5E",
														overflow: "hidden",
														textOverflow: "ellipsis"
													},
													children: user.email
												})]
											}),
											user.role === "admin" ? /* @__PURE__ */ jsxs("button", {
												onClick: () => {
													setIsUserMenuOpen(false);
													if (onOpenAdmin) onOpenAdmin();
												},
												style: {
													display: "flex",
													alignItems: "center",
													gap: "8px",
													padding: "10px 12px",
													borderRadius: "10px",
													border: "none",
													backgroundColor: "transparent",
													color: "#d97706",
													fontSize: "13px",
													fontWeight: "600",
													cursor: "pointer",
													textAlign: "left",
													width: "100%"
												},
												children: [
													/* @__PURE__ */ jsx(Shield, {
														size: 16,
														color: "#d97706"
													}),
													" ",
													/* @__PURE__ */ jsx("span", { children: "Quản Trị Admin" })
												]
											}) : /* @__PURE__ */ jsxs("button", {
												onClick: () => {
													setIsUserMenuOpen(false);
													if (onOpenMyCards) onOpenMyCards();
												},
												style: {
													display: "flex",
													alignItems: "center",
													gap: "8px",
													padding: "10px 12px",
													borderRadius: "10px",
													border: "none",
													backgroundColor: "transparent",
													color: "#4F3033",
													fontSize: "13px",
													fontWeight: "600",
													cursor: "pointer",
													textAlign: "left",
													width: "100%"
												},
												children: [
													/* @__PURE__ */ jsx(FolderHeart, {
														size: 16,
														color: "#F04468"
													}),
													" ",
													/* @__PURE__ */ jsx("span", { children: "Thiệp Của Tôi" })
												]
											}),
											/* @__PURE__ */ jsxs("button", {
												onClick: () => {
													setIsUserMenuOpen(false);
													if (onLogout) onLogout();
												},
												style: {
													display: "flex",
													alignItems: "center",
													gap: "8px",
													padding: "10px 12px",
													borderRadius: "10px",
													border: "none",
													backgroundColor: "transparent",
													color: "#ef4444",
													fontSize: "13px",
													fontWeight: "600",
													cursor: "pointer",
													textAlign: "left",
													width: "100%",
													borderTop: "1px solid #f1f5f9",
													marginTop: "4px"
												},
												children: [
													/* @__PURE__ */ jsx(LogOut, {
														size: 16,
														color: "#ef4444"
													}),
													" ",
													/* @__PURE__ */ jsx("span", { children: "Đăng Xuất" })
												]
											})
										]
									})]
								}) : /* @__PURE__ */ jsx("button", {
									className: "landing-header__login",
									onClick: onOpenAuthModal,
									style: {
										padding: "8px 22px",
										color: "#4F3033",
										fontSize: "14px",
										fontWeight: "600",
										backgroundColor: "rgba(255, 255, 255, 0.8)",
										border: "1px solid rgba(217, 91, 112, 0.18)",
										borderRadius: "24px",
										cursor: "pointer"
									},
									children: "Đăng nhập"
								}),
								/* @__PURE__ */ jsx("button", {
									className: "landing-header__create",
									onClick: () => {
										if (user?.role === "admin") {
											if (onOpenAdmin) onOpenAdmin();
										} else onGoToEditor();
									},
									style: {
										padding: "10px 24px",
										borderRadius: "24px",
										background: "linear-gradient(135deg, #F04468 0%, #DC3659 100%)",
										color: "#ffffff",
										fontSize: "14px",
										fontWeight: "700",
										border: "none",
										cursor: "pointer",
										boxShadow: "0 10px 26px rgba(240, 68, 104, 0.25)",
										display: "flex",
										alignItems: "center",
										gap: "6px"
									},
									children: /* @__PURE__ */ jsx("span", { children: user?.role === "admin" ? "Trang Quản Trị" : "Tạo thiệp ngay" })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "landing-header__menu-toggle",
									onClick: () => setIsMobileMenuOpen(true),
									"aria-label": "Mở menu",
									"aria-expanded": isMobileMenuOpen,
									"aria-controls": "landing-mobile-menu",
									children: /* @__PURE__ */ jsx(Menu, { size: 23 })
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(MobileLandingMenu, {
				isOpen: isMobileMenuOpen,
				onClose: closeMobileMenu,
				activeNav,
				onNavigate: handleNavClick,
				onCreate: createCard,
				onLogin: onOpenAuthModal,
				user,
				onMyCards: onOpenMyCards,
				onAdmin: onOpenAdmin,
				onLogout
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "landing-flow",
				style: { width: "100%" },
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "landing-intro",
						style: { "--intro-artwork": `url(${hero_why_us_continuous_default})` },
						children: [/* @__PURE__ */ jsx(HeroSection, {
							onCreate: () => {
								if (user?.role === "admin") onOpenAdmin?.();
								else onGoToEditor();
							},
							onViewTemplates: () => handleNavClick("templates")
						}), /* @__PURE__ */ jsx(WhyUsSection, {})]
					}),
					/* @__PURE__ */ jsx(TemplateGallery, { onGoToEditor }),
					/* @__PURE__ */ jsxs("div", {
						className: "landing-experience",
						style: { "--experience-artwork": `url(${hero_why_us_continuous_default})` },
						children: [
							/* @__PURE__ */ jsx(HowItWorksSection, { onCreate: () => {
								if (user?.role === "admin") onOpenAdmin?.();
								else onGoToEditor();
							} }),
							/* @__PURE__ */ jsx(FeaturesSection, { onCreate: () => {
								if (user?.role === "admin") onOpenAdmin?.();
								else onGoToEditor();
							} }),
							/* @__PURE__ */ jsx(PricingSection, { onGoToEditor })
						]
					}),
					/* @__PURE__ */ jsx(TestimonialsSection, { onCreate: () => {
						if (user?.role === "admin") onOpenAdmin?.();
						else onGoToEditor();
					} }),
					/* @__PURE__ */ jsxs("div", {
						className: "landing-finale",
						style: { "--finale-artwork": `url(${background_default})` },
						children: [/* @__PURE__ */ jsx(FaqSection, { settings: publicSettings }), /* @__PURE__ */ jsx("section", {
							id: "contact",
							className: "landing-final-cta",
							"aria-labelledby": "landing-final-cta-title",
							children: /* @__PURE__ */ jsxs("div", {
								className: "landing-final-cta__inner",
								children: [
									/* @__PURE__ */ jsx("h2", {
										id: "landing-final-cta-title",
										children: "Tạo Thiệp Cưới Của Riêng Bạn Ngay Hôm Nay"
									}),
									/* @__PURE__ */ jsx("p", { children: "Gửi trao yêu thương theo cách sang trọng, tiện lợi và tiết kiệm nhất cho ngày trọng đại." }),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => {
											if (user?.role === "admin") onOpenAdmin?.();
											else onGoToEditor();
										},
										children: [/* @__PURE__ */ jsx("span", { children: "Tạo Thiệp Cưới Miễn Phí" }), /* @__PURE__ */ jsx(ArrowRight, { size: 18 })]
									})
								]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(SiteFooter, { settings: publicSettings }),
			user && /* @__PURE__ */ jsxs("nav", {
				className: "my-card-bottom-nav",
				"aria-label": "Điều hướng trên điện thoại",
				children: [
					/* @__PURE__ */ jsxs("button", {
						"aria-current": "page",
						onClick: () => window.scrollTo({
							top: 0,
							behavior: "smooth"
						}),
						children: [/* @__PURE__ */ jsx(Home, {}), /* @__PURE__ */ jsx("span", { children: "Trang chủ" })]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => onOpenMyCards("templates"),
						children: [/* @__PURE__ */ jsx(LayoutGrid, {}), /* @__PURE__ */ jsx("span", { children: "Mẫu thiệp" })]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => onOpenMyCards(),
						children: [/* @__PURE__ */ jsx(Heart, {}), /* @__PURE__ */ jsx("span", { children: "Thiệp của tôi" })]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setIsMobileMenuOpen(true),
						children: [/* @__PURE__ */ jsx(UserRound, {}), /* @__PURE__ */ jsx("span", { children: "Tài khoản" })]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/landing-ssr.jsx
function render() {
	return renderToStaticMarkup(/* @__PURE__ */ jsx(LandingPage, {}));
}
//#endregion
export { render };
