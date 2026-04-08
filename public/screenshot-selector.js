// Content script: injects overlay for screenshot region selection
(function () {
	// Remove any existing overlay first
	const existing = document.getElementById("__screenshot-overlay");
	if (existing) existing.remove();

	const overlay = document.createElement("div");
	overlay.id = "__screenshot-overlay";
	Object.assign(overlay.style, {
		position: "fixed",
		top: "0",
		left: "0",
		width: "100%",
		height: "100%",
		zIndex: "2147483647",
		cursor: "crosshair",
		background: "rgba(0,0,0,0.3)",
		userSelect: "none",
		margin: "0",
		padding: "0",
	});

	const selection = document.createElement("div");
	Object.assign(selection.style, {
		position: "absolute",
		border: "2px solid #4A90D9",
		background: "rgba(74,144,217,0.15)",
		display: "none",
		pointerEvents: "none",
		zIndex: "2147483647",
	});
	overlay.appendChild(selection);

	const instructions = document.createElement("div");
	Object.assign(instructions.style, {
		position: "absolute",
		top: "16px",
		left: "50%",
		transform: "translateX(-50%)",
		background: "rgba(0,0,0,0.75)",
		color: "#fff",
		padding: "8px 16px",
		borderRadius: "6px",
		fontSize: "14px",
		fontFamily: "sans-serif",
		pointerEvents: "none",
		zIndex: "2147483647",
	});
	instructions.textContent = "Click and drag to select a region. Press Escape to cancel.";
	overlay.appendChild(instructions);

	let startX, startY, dragging = false;

	function cleanup() {
		overlay.remove();
		document.removeEventListener("keydown", onKeydown, true);
	}

	function onKeydown(e) {
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			cleanup();
			chrome.runtime.sendMessage({ type: "screenshot-cancelled" });
		}
	}

	overlay.addEventListener("mousedown", function (e) {
		e.preventDefault();
		e.stopPropagation();
		startX = e.clientX;
		startY = e.clientY;
		dragging = true;
		selection.style.display = "block";
		selection.style.left = startX + "px";
		selection.style.top = startY + "px";
		selection.style.width = "0px";
		selection.style.height = "0px";
		instructions.style.display = "none";
	}, true);

	overlay.addEventListener("mousemove", function (e) {
		if (!dragging) return;
		e.preventDefault();
		const x = Math.min(e.clientX, startX);
		const y = Math.min(e.clientY, startY);
		const w = Math.abs(e.clientX - startX);
		const h = Math.abs(e.clientY - startY);
		selection.style.left = x + "px";
		selection.style.top = y + "px";
		selection.style.width = w + "px";
		selection.style.height = h + "px";
	}, true);

	overlay.addEventListener("mouseup", function (e) {
		if (!dragging) return;
		e.preventDefault();
		e.stopPropagation();
		dragging = false;

		const rect = {
			x: Math.min(e.clientX, startX),
			y: Math.min(e.clientY, startY),
			width: Math.abs(e.clientX - startX),
			height: Math.abs(e.clientY - startY),
		};

		cleanup();

		if (rect.width < 5 || rect.height < 5) {
			chrome.runtime.sendMessage({ type: "screenshot-cancelled" });
			return;
		}

		chrome.runtime.sendMessage({
			type: "screenshot-region",
			rect: rect,
			devicePixelRatio: window.devicePixelRatio,
			viewportWidth: window.innerWidth,
			viewportHeight: window.innerHeight,
		});
	}, true);

	document.addEventListener("keydown", onKeydown, true);
	document.body.appendChild(overlay);
})();
