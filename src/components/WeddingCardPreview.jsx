import React, { useRef, useEffect, useState } from 'react';

export default function WeddingCardPreview({ 
  cardData, 
  setCardData, 
  viewMode, 
  selectedTemplate,
  onOpenEditSection,
  targetPreviewSelector,
  onOpenVietQR, 
  onOpenRSVP,
  onOpenDatePicker,
  onOpenMapModal,
  activeMobileTab
}) {
  const iframeRef = useRef(null);
  const fileInputRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [targetImageField, setTargetImageField] = useState('heroImage');
  const [clickedImageEl, setClickedImageEl] = useState(null);

  // Smooth scroll & glow highlight element in iframe when sidebar input is focused
  useEffect(() => {
    if (!targetPreviewSelector || !iframeRef.current || !iframeLoaded) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      if (!doc) return;
      const targetEl = doc.querySelector(targetPreviewSelector);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.style.transition = 'all 0.3s ease';
        targetEl.style.outline = '3px solid #e11d48';
        targetEl.style.outlineOffset = '4px';
        setTimeout(() => {
          targetEl.style.outline = 'none';
        }, 2200);
      }
    } catch (err) {}
  }, [targetPreviewSelector, iframeLoaded]);

  // Auto scroll to section & focus target element on mobile bottom bar tab change
  useEffect(() => {
    if (!iframeLoaded || !iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      if (!doc) return;

      let targetSectionId = null;
      let focusSelector = null;

      if (activeMobileTab === 'couple') {
        targetSectionId = '#SECTION2';
        focusSelector = '#PARAGRAPH3 .ladi-paragraph';
      } else if (activeMobileTab === 'event') {
        targetSectionId = '#SECTION5';
        focusSelector = '#PARAGRAPH6 .ladi-paragraph';
      } else if (activeMobileTab === 'album') {
        targetSectionId = '#SECTION3';
      } else if (activeMobileTab === 'vietqr') {
        targetSectionId = '#SECTION4';
        const popupEl = doc.querySelector('#POPUP2');
        const backdropEl = doc.querySelector('#backdrop-popup');
        if (popupEl) {
          popupEl.style.display = 'block';
          popupEl.classList.add('show');
        }
        if (backdropEl) {
          backdropEl.style.display = 'block';
          backdropEl.classList.add('show');
        }
      } else if (activeMobileTab === 'preview') {
        targetSectionId = '#SECTION1';
      }

      if (activeMobileTab !== 'vietqr') {
        const popupEl = doc.querySelector('#POPUP2');
        const backdropEl = doc.querySelector('#backdrop-popup');
        if (popupEl && popupEl.style.display === 'block') {
          popupEl.style.display = 'none';
          popupEl.classList.remove('show');
        }
        if (backdropEl && backdropEl.style.display === 'block') {
          backdropEl.style.display = 'none';
          backdropEl.classList.remove('show');
        }
      }

      if (targetSectionId) {
        const sec = doc.querySelector(targetSectionId);
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      if (focusSelector) {
        setTimeout(() => {
          const elToFocus = doc.querySelector(focusSelector);
          if (elToFocus) {
            elToFocus.focus();
          }
        }, 350);
      }
    } catch (err) {
      console.warn('Mobile tab section scroll error:', err);
    }
  }, [activeMobileTab, iframeLoaded]);

  // Trigger File Picker for Image Upload
  const handleImagePickerTrigger = (field, targetEl) => {
    setTargetImageField(field);
    setClickedImageEl(targetEl);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        if (targetImageField) {
          setCardData(prev => ({ ...prev, [targetImageField]: dataUrl }));
        }
        if (clickedImageEl) {
          if (clickedImageEl.tagName && clickedImageEl.tagName.toLowerCase() === 'img') {
            clickedImageEl.src = dataUrl;
          } else {
            clickedImageEl.style.backgroundImage = `url("${dataUrl}")`;
          }
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Synchronize React state to iframe & enable In-place Text Editing + Image Click Pickers
  useEffect(() => {
    if (!iframeLoaded || !iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      if (!doc) return;

      // 1. Update Text values inside iframe (only if user is not currently typing into that element)
      const updateTextIfNotActive = (selector, value) => {
        const el = doc.querySelector(selector);
        if (el && doc.activeElement !== el) {
          el.innerText = value;
        }
      };

      updateTextIfNotActive('#HEADLINE3 .ladi-headline', cardData.title);
      updateTextIfNotActive('#PARAGRAPH2 .ladi-paragraph', cardData.weddingDate);
      updateTextIfNotActive('#PARAGRAPH3 .ladi-paragraph', cardData.groomName);
      updateTextIfNotActive('#PARAGRAPH5 .ladi-paragraph', cardData.brideName);
      updateTextIfNotActive('#PARAGRAPH6 .ladi-paragraph', cardData.groomAddress);
      if (cardData.groomParents) updateTextIfNotActive('#PARAGRAPH8 .ladi-paragraph', cardData.groomParents);
      if (cardData.brideParents) updateTextIfNotActive('#PARAGRAPH9 .ladi-paragraph', cardData.brideParents);

      // Sync Google Maps Link on #BUTTON10 ("Xem chỉ đường")
      const button10 = doc.querySelector('#BUTTON10');
      if (button10) {
        const targetMapUrl = cardData.groomMapUrl && cardData.groomMapUrl.trim() !== '' && cardData.groomMapUrl !== 'https://maps.google.com'
          ? cardData.groomMapUrl
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.groomAddress || '')}`;
        button10.setAttribute('href', targetMapUrl);
        button10.setAttribute('data-replace-href', targetMapUrl);
        button10.style.cursor = 'pointer';
        button10.title = '📍 Click để dán/chỉnh sửa đường dẫn Google Maps chỉ đường';

        button10.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onOpenMapModal) {
            onOpenMapModal('groom');
          }
        };
      }

      // Universal Image Element Updater (Handles all LadiPage image container variants)
      const applyImageToElement = (el, dataUrl) => {
        if (!el || !dataUrl) return;
        if (el.tagName && el.tagName.toLowerCase() === 'img') {
          el.src = dataUrl;
        } else {
          el.style.setProperty('background-image', `url("${dataUrl}")`, 'important');
        }
        const bgChildren = el.querySelectorAll ? el.querySelectorAll('.ladi-image-background, .ladi-section-background, img') : [];
        bgChildren.forEach(b => {
          if (b.tagName && b.tagName.toLowerCase() === 'img') {
            b.src = dataUrl;
          } else {
            b.style.setProperty('background-image', `url("${dataUrl}")`, 'important');
          }
        });
      };

      // Sync image URLs from React cardData state into iframe DOM (only if custom dataUrl is provided)
      if (cardData.heroImage && (cardData.heroImage.startsWith('data:') || cardData.heroImage.startsWith('http') || cardData.heroImage.startsWith('/'))) {
        applyImageToElement(doc.querySelector('#IMAGE3'), cardData.heroImage);
        applyImageToElement(doc.querySelector('#IMAGE59'), cardData.heroImage);
      }
      if (cardData.groomPhoto && cardData.groomPhoto.startsWith('data:')) {
        applyImageToElement(doc.querySelector('#IMAGE50'), cardData.groomPhoto);
        applyImageToElement(doc.querySelector('#IMAGE52'), cardData.groomPhoto);
      }
      if (cardData.bridePhoto && cardData.bridePhoto.startsWith('data:')) {
        applyImageToElement(doc.querySelector('#IMAGE49'), cardData.bridePhoto);
        applyImageToElement(doc.querySelector('#IMAGE51'), cardData.bridePhoto);
      }

      // Date string parser helper: "20 . 09 . 2026" or "2026-09-20" -> { year, month, day }
      const parseDateComponents = (str) => {
        if (!str) return { year: 2026, month: 9, day: 20 };
        if (str.includes('-')) {
          const parts = str.split('-').map(Number);
          if (parts.length === 3) return { year: parts[0], month: parts[1], day: parts[2] };
        }
        const nums = str.split('.').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (nums.length === 3) {
          if (nums[0] > 1000) return { year: nums[0], month: nums[1], day: nums[2] };
          return { day: nums[0], month: nums[1], year: nums[2] };
        }
        return { year: 2026, month: 9, day: 20 };
      };

      const { year: curY, month: curM, day: curD } = parseDateComponents(cardData.weddingDate);

      // Render Dynamic Calendar Grid & Position Heart Marker (#IMAGE21)
      const renderCalendarGrid = (year, month, day) => {
        const monthStr = String(month).padStart(2, '0');
        const yearStr = String(year);
        const dayStr = String(day).padStart(2, '0');

        // Update Month Title (#PARAGRAPH12)
        const monthTitleEl = doc.querySelector('#PARAGRAPH12 .ladi-paragraph');
        if (monthTitleEl) {
          monthTitleEl.innerText = `Tháng ${monthStr} - ${yearStr}`;
        }

        // Update Wedding Date (#PARAGRAPH2)
        const mainDateEl = doc.querySelector('#PARAGRAPH2 .ladi-paragraph');
        if (mainDateEl && doc.activeElement !== mainDateEl) {
          mainDateEl.innerText = `${dayStr} . ${monthStr} . ${yearStr}`;
        }

        // Calculate 1st day of month (Monday=0, Tuesday=1 ... Sunday=6)
        const firstDayObj = new Date(year, month - 1, 1);
        let startCol = firstDayObj.getDay(); // 0=Sunday, 1=Monday...
        startCol = (startCol === 0) ? 6 : startCol - 1;

        const totalDaysInMonth = new Date(year, month, 0).getDate();

        const colLefts = [28.0, 74.0, 120.0, 166.0, 210.0, 254.0, 298.0];
        const rowTops = [54.0, 95.0, 135.0, 177.0, 221.0, 263.0];

        const dayParas = [
          '#PARAGRAPH13', '#PARAGRAPH14', '#PARAGRAPH15', '#PARAGRAPH16', '#PARAGRAPH17',
          '#PARAGRAPH18', '#PARAGRAPH19', '#PARAGRAPH20', '#PARAGRAPH21', '#PARAGRAPH22',
          '#PARAGRAPH23', '#PARAGRAPH24', '#PARAGRAPH25', '#PARAGRAPH26', '#PARAGRAPH27',
          '#PARAGRAPH28', '#PARAGRAPH29', '#PARAGRAPH30', '#PARAGRAPH31', '#PARAGRAPH32',
          '#PARAGRAPH33', '#PARAGRAPH34', '#PARAGRAPH35', '#PARAGRAPH36', '#PARAGRAPH37',
          '#PARAGRAPH38', '#PARAGRAPH39', '#PARAGRAPH40', '#PARAGRAPH41', '#PARAGRAPH42'
        ];

        let targetHeartLeft = null;
        let targetHeartTop = null;

        dayParas.forEach((selector, idx) => {
          const el = doc.querySelector(selector);
          if (!el) return;
          const dayNum = idx + 1;
          if (dayNum <= totalDaysInMonth) {
            el.style.display = 'block';
            const gridCell = startCol + idx;
            const col = gridCell % 7;
            const row = Math.floor(gridCell / 7);

            el.style.left = colLefts[col] + 'px';
            el.style.top = rowTops[row] + 'px';

            const innerP = el.querySelector('.ladi-paragraph');
            if (innerP) innerP.innerText = String(dayNum);

            if (dayNum === Number(day)) {
              targetHeartLeft = (colLefts[col] - 8) + 'px';
              targetHeartTop = (rowTops[row] - 10) + 'px';
            }
          } else {
            el.style.display = 'none';
          }
        });

        // Position Heart Circle Marker (#IMAGE21) & Override LadiPage Animation Scripts with Injected Style Tag
        const heartEl = doc.querySelector('#IMAGE21');
        if (heartEl && targetHeartLeft && targetHeartTop) {
          heartEl.classList.remove('ladi-animation-hidden', 'ladi-animation');
          heartEl.removeAttribute('data-action');

          let styleHeartEl = doc.querySelector('#saas-heart-position-style');
          if (!styleHeartEl) {
            styleHeartEl = doc.createElement('style');
            styleHeartEl.id = 'saas-heart-position-style';
            doc.head.appendChild(styleHeartEl);
          }

          styleHeartEl.innerHTML = `
            #IMAGE21, #IMAGE21 * {
              left: ${targetHeartLeft} !important;
              top: ${targetHeartTop} !important;
              display: block !important;
              opacity: 1 !important;
              visibility: visible !important;
              z-index: 20 !important;
              animation: none !important;
              transform: none !important;
              transition: left 0.3s ease, top 0.3s ease !important;
            }
          `;
        }
      };

      renderCalendarGrid(curY, curM, curD);

      // Ensure Date Picker Input exists inside iframe
      let iframeDatePicker = doc.querySelector('#saas-iframe-date-picker');
      if (!iframeDatePicker) {
        iframeDatePicker = doc.createElement('input');
        iframeDatePicker.type = 'date';
        iframeDatePicker.id = 'saas-iframe-date-picker';
        iframeDatePicker.style.position = 'fixed';
        iframeDatePicker.style.opacity = '0';
        iframeDatePicker.style.pointerEvents = 'none';
        iframeDatePicker.style.bottom = '0';
        doc.body.appendChild(iframeDatePicker);
      }

      // Attach Date Picker Click to Calendar Grid (#GROUP89), Tháng 09 - 2026 (#PARAGRAPH12) & SAVE THE DATE (#PARAGRAPH11)
      const dateTriggerEls = doc.querySelectorAll('#GROUP89, #GROUP89 *, #PARAGRAPH12, #PARAGRAPH11, #PARAGRAPH12 .ladi-paragraph, #PARAGRAPH11 .ladi-paragraph, #PARAGRAPH2, #PARAGRAPH2 .ladi-paragraph');
      dateTriggerEls.forEach(el => {
        el.style.cursor = 'pointer';
        el.title = '📅 Click để mở Date Picker chọn ngày cưới';
        el.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (viewMode !== 'mobile' && onOpenEditSection) onOpenEditSection('event');
          if (onOpenDatePicker) {
            onOpenDatePicker();
          } else {
            const { year: y, month: m, day: d } = parseDateComponents(cardData.weddingDate);
            iframeDatePicker.value = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            
            iframeDatePicker.onchange = (evt) => {
              const val = evt.target.value; // "YYYY-MM-DD"
              if (val) {
                const [newY, newM, newD] = val.split('-').map(Number);
                const formattedDate = `${String(newD).padStart(2,'0')} . ${String(newM).padStart(2,'0')} . ${newY}`;
                setCardData(prev => ({ ...prev, weddingDate: formattedDate }));
                renderCalendarGrid(newY, newM, newD);
              }
            };

            if (typeof iframeDatePicker.showPicker === 'function') {
              try {
                iframeDatePicker.showPicker();
              } catch(err) {
                iframeDatePicker.click();
              }
            } else {
              iframeDatePicker.click();
            }
          }
        };
      });

      // 2. Enable IN-PLACE DIRECT TEXT EDITING (Contenteditable + live input/blur handlers)
      const textElements = doc.querySelectorAll('.ladi-headline, .ladi-paragraph, h1, h2, h3, p, span');
      textElements.forEach(el => {
        // Exclude calendar grid numbers (#GROUP89) and date titles (#PARAGRAPH12, #PARAGRAPH11) from manual typing
        if (el.closest('#GROUP89') || el.closest('#PARAGRAPH12') || el.closest('#PARAGRAPH11')) {
          el.removeAttribute('contenteditable');
          el.style.cursor = 'pointer';
          return;
        }

        el.setAttribute('contenteditable', 'true');
        el.style.cursor = 'text';

        const parentLadiElem = el.closest('.ladi-element');
        if (parentLadiElem) {
          parentLadiElem.style.setProperty('pointer-events', 'auto', 'important');
          parentLadiElem.style.setProperty('z-index', '99', 'important');
        }

        const syncToState = (e) => {
          const id = e.target.closest('.ladi-element')?.id;
          const text = e.target.innerText;
          if (id === 'HEADLINE3') setCardData(prev => ({ ...prev, title: text }));
          else if (id === 'PARAGRAPH2') setCardData(prev => ({ ...prev, weddingDate: text }));
          else if (id === 'PARAGRAPH3') setCardData(prev => ({ ...prev, groomName: text }));
          else if (id === 'PARAGRAPH5') setCardData(prev => ({ ...prev, brideName: text }));
          else if (id === 'PARAGRAPH6') setCardData(prev => ({ ...prev, groomAddress: text }));
          else if (id === 'PARAGRAPH8') setCardData(prev => ({ ...prev, groomParents: text }));
          else if (id === 'PARAGRAPH9') setCardData(prev => ({ ...prev, brideParents: text }));
          else if (id === 'PARAGRAPH7') setCardData(prev => ({ ...prev, invitationQuote: text }));
          else if (id === 'PARAGRAPH10') setCardData(prev => ({ ...prev, brideAddress: text }));
        };

        const handleElementClick = (e) => {
          const id = e.target.closest('.ladi-element')?.id || '';
          let fieldId = null;
          let tabId = 'content';

          if (id === 'HEADLINE3') fieldId = 'field-title';
          else if (id === 'PARAGRAPH2') fieldId = 'field-weddingDate';
          else if (id === 'PARAGRAPH3') fieldId = 'field-groomName';
          else if (id === 'PARAGRAPH8') fieldId = 'field-groomParents';
          else if (id === 'PARAGRAPH5') fieldId = 'field-brideName';
          else if (id === 'PARAGRAPH9') fieldId = 'field-brideParents';
          else if (id === 'PARAGRAPH6') fieldId = 'field-groomAddress';
          else if (id === 'PARAGRAPH10') fieldId = 'field-brideAddress';

          if (onOpenEditSection) {
            onOpenEditSection(tabId, fieldId);
          }

          try {
            el.focus();
          } catch(err) {}
        };

        el.onclick = handleElementClick;
        el.onfocus = handleElementClick;
        el.oninput = syncToState;
        el.onblur = syncToState;
      });

      // Ensure same-document file input exists inside iframe to bypass cross-window security restrictions
      let iframeFileInput = doc.querySelector('#saas-iframe-image-picker');
      if (!iframeFileInput) {
        iframeFileInput = doc.createElement('input');
        iframeFileInput.type = 'file';
        iframeFileInput.id = 'saas-iframe-image-picker';
        iframeFileInput.accept = 'image/*';
        iframeFileInput.style.display = 'none';
        doc.body.appendChild(iframeFileInput);
      }

      // Clear photo hover & click handlers from section backgrounds
      doc.querySelectorAll('.ladi-section-background').forEach(secBg => {
        secBg.classList.remove('photo-hoverable');
        secBg.classList.add('no-photo-hover');
        secBg.style.cursor = 'default';
        secBg.removeAttribute('title');
        secBg.onclick = null;
      });

      // 3. Direct Image Click Trigger (Target ONLY photo slots, exclude section backgrounds & small decorative icons)
      const images = doc.querySelectorAll('.ladi-element .ladi-image, .ladi-element .ladi-image-background, .ladi-element > img');
      images.forEach(img => {
        if (img.classList.contains('ladi-section-background')) return;
        const parentElem = img.closest('.ladi-element');
        const parentId = parentElem?.id || img.id || '';

        // Exclude known small decorative icons, lanterns, border ornaments, and small graphics (< 80px)
        const decoIds = [
          'IMAGE1', 'IMAGE2', 'IMAGE4', 'IMAGE5', 'IMAGE6', 'IMAGE7', 'IMAGE8', 
          'IMAGE9', 'IMAGE10', 'IMAGE11', 'IMAGE12', 'IMAGE13', 'IMAGE60', 'IMAGE61', 'IMAGE120', 'IMAGE128'
        ];

        const isDeco = decoIds.includes(parentId) || 
                       (parentElem && (parentElem.offsetWidth < 80 || parentElem.offsetHeight < 80)) ||
                       (img.offsetWidth > 0 && img.offsetWidth < 80 && img.offsetHeight < 80);

        if (isDeco) {
          img.style.cursor = 'default';
          img.onclick = null;
          img.classList.add('no-photo-hover');
          img.classList.remove('photo-hoverable');
          return;
        }

        img.classList.add('photo-hoverable');
        img.classList.remove('no-photo-hover');
        img.style.cursor = 'pointer';
        img.title = '📷 Click để chọn file ảnh mới thay thế ảnh này';
        img.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (viewMode !== 'mobile' && onOpenEditSection) onOpenEditSection('album');
          const targetEl = e.currentTarget;
          const elementContainer = targetEl.closest('.ladi-element') || targetEl.closest('.ladi-section') || targetEl;
          const containerId = elementContainer.id || '';
          let field = 'heroImage';
          if (containerId === 'IMAGE50' || containerId === 'IMAGE52' || containerId.includes('groom')) field = 'groomPhoto';
          else if (containerId === 'IMAGE49' || containerId === 'IMAGE51' || containerId.includes('bride')) field = 'bridePhoto';

          iframeFileInput.onchange = (evt) => {
            const file = evt.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (reEvt) => {
                const dataUrl = reEvt.target.result;
                setCardData(prev => ({ ...prev, [field]: dataUrl }));

                applyImageToElement(elementContainer, dataUrl);
                applyImageToElement(targetEl, dataUrl);
              };
              reader.readAsDataURL(file);
            }
            evt.target.value = '';
          };

          iframeFileInput.click();
        };
      });

      // 4. Inject WP Customizer Pencil Styles & Photo Focus Highlights
      if (!doc.querySelector('#wp-customizer-pencil-style')) {
        const styleEl = doc.createElement('style');
        styleEl.id = 'wp-customizer-pencil-style';
        styleEl.innerHTML = `
          html {
            margin: 0 !important;
            padding: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding-bottom: 0 !important;
          }
          body, img, p, div, span, a, .ladi-headline, .ladi-paragraph, [contenteditable="true"] {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
          }
          /* Hide footer watermark branding elements & Powered by LadiPage badge */
          #HEADLINE25, #SHAPE8, #SHAPE9, #SHAPE10, #BOX4,
          [class*="_NOYF"], [class*="NOYF"], body > div[style*="1000000000"], body > div[style*="ladipage.svg"], div[style*="ladipage.svg"], a[href*="ladipage"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }
          .ladi-wraper {
            overflow: hidden !important;
          }
          #SECTION1 {
            position: relative;
          }
          #IMAGE119, #IMAGE119 *, #IMAGE120, #IMAGE120 * {
            background-size: cover !important;
            background-position: center !important;
          }
          /* Position Thank You overlay block (#GROUP27) flush at the bottom of photo (#IMAGE59) */
          #GROUP27 {
            top: 408.5px !important;
          }
          /* Pass clicks through decorative full-width/full-height group layers (like GROUP88) */
          .ladi-group, .ladi-element:has(.ladi-group), #GROUP88, #GROUP88 *, #GROUP4, #GROUP5 {
            pointer-events: none !important;
          }
          #GROUP88 {
            z-index: 50 !important;
          }
          #GROUP89, #GROUP89 * {
            z-index: 100 !important;
            pointer-events: auto !important;
          }
          .photo-hoverable {
            pointer-events: auto !important;
          }
          .ladi-headline, .ladi-paragraph, h1, h2, h3, h4, h5, h6, p, span, [contenteditable="true"], #BUTTON10, #BUTTON10 * {
            transition: outline 0.15s ease !important;
            pointer-events: auto !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          .ladi-element:has([contenteditable="true"]) {
            pointer-events: auto !important;
          }
          .ladi-headline:hover, .ladi-paragraph:hover, h1:hover, h2:hover, h3:hover, p:hover, [contenteditable="true"]:hover {
            outline: 1.5px dashed #2563eb !important;
            outline-offset: 2px !important;
            border-radius: 3px !important;
          }
          .ladi-headline:focus, .ladi-paragraph:focus, h1:focus, h2:focus, h3:focus, p:focus, [contenteditable="true"]:focus {
            outline: 2px solid #2563eb !important;
            outline-offset: 2px !important;
            background-color: rgba(37, 99, 235, 0.08) !important;
            border-radius: 3px !important;
          }
          .photo-hoverable {
            transition: outline 0.15s ease, filter 0.15s ease !important;
          }
          .photo-hoverable:hover {
            outline: 2.5px dashed #2563eb !important;
            outline-offset: -2px !important;
            filter: brightness(1.05) !important;
            cursor: pointer !important;
          }
          .no-photo-hover, .no-photo-hover:hover {
            outline: none !important;
            filter: none !important;
            cursor: default !important;
          }
          #GROUP89, #GROUP89 *, #GROUP89:hover, #GROUP89 *:hover, #GROUP89:focus, #GROUP89 *:focus {
            outline: none !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            cursor: pointer !important;
          }
          #POPUP2 {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            z-index: 100000 !important;
            margin: 0 !important;
            transform: none !important;
          }
          #POPUP2 .ladi-popup {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            transform: none !important;
            margin: 0 !important;
            background: #ffffff !important;
          }
          #backdrop-popup {
            display: none !important;
            opacity: 0 !important;
          }
        `;
        doc.head.appendChild(styleEl);
      }

      // 5. Hide legacy floating live-editor-bar inside iframe to avoid overlapping with SaaS MobileBottomBar
      const liveEditorBar = doc.querySelector('#live-editor-bar');
      if (liveEditorBar) {
        liveEditorBar.style.display = 'none';
      }

      // 6. Remove dynamic Powered by LadiPage watermark elements
      doc.querySelectorAll('[class*="_NOYF"], [class*="NOYF"], body > div[style*="1000000000"], body > div[style*="ladipage.svg"], div[style*="ladipage.svg"]').forEach(el => {
        el.remove();
      });

      // 7. Ensure doc.body padding is 0
      if (doc.body) {
        doc.body.style.paddingBottom = '0px';
      }

    } catch (err) {
      console.warn('Iframe DOM sync error:', err);
    }
  }, [cardData, iframeLoaded, onOpenEditSection, viewMode]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const isMobile = viewMode === 'mobile';
  const targetFileUrl = selectedTemplate?.fileUrl || '/template.html';

  return (
    <main style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '0' : '20px',
      backgroundColor: '#fdf8f9',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(254, 205, 211, 0.3) 0%, rgba(253, 248, 249, 0) 70%)',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      height: '100%'
    }}>
      {/* Hidden File Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Frame Container */}
      <div style={{
        width: isMobile ? '100%' : '390px',
        maxWidth: '100%',
        height: isMobile ? '100%' : 'calc(100% - 20px)',
        maxHeight: isMobile ? '100%' : '840px',
        backgroundColor: '#ffffff',
        borderRadius: isMobile ? '0px' : '32px',
        border: isMobile ? 'none' : '8px solid #0f172a',
        boxShadow: isMobile ? 'none' : '0 25px 60px -15px rgba(225, 29, 72, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Original Template Iframe */}
        <iframe
          key={selectedTemplate?.id || 'template_01'}
          ref={iframeRef}
          src={targetFileUrl}
          title={selectedTemplate?.name || "Thiệp Cưới Gốc"}
          onLoad={handleIframeLoad}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            border: 'none',
            display: 'block'
          }}
        />
      </div>
    </main>
  );
}
