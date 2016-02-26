/**
 * LBS drawBarChart 柱状图 横向模式 最大数值小于一亿
 * Date: 2015-04-24
 * ==================================
 * opts.parent 插入到哪里 一个JS元素对象
 * opts.width 画布宽度 默认600(px)
 * opts.barWidth 柱宽 默认50(px)
 * opts.spacedWidth 柱与柱间隔宽 默认5(px)
 * opts.topSpaced 绘画区域距画布顶部距离  默认50(px)
 * opts.leftSpaced 绘画区域距画布左边距离  默认80(px)
 * opts.data 柱状图数据
 * opts.color 柱颜色 线条颜色 刻度颜色 刻度文字颜色 默认'#000'
 * opts.lineColor 轴线颜色、轴文字颜色 默认'#000'
 * opts.lineSize 轴文字大小 默认'20px'
 * opts.textColor 文字渲染颜色 默认'#000'
 * opts.textSize 文字渲染大小 默认'20px'
 * opts.animated 是否以动画的方式绘制 默认false
 * opts.duration 动画持续时间 默认500(ms)
 * opts.delay 每个bar绘制的间隔时间 默认100(ms)
 * opts.after 绘制完成时执行函数
 * ==================================
 **/

var drawBarChart = function(opts) {
	var _opts = {
			parent: document.body,
			width: 600,
			barWidth: 50,
			spacedWidth: 5,
			topSpaced: 50,
			leftSpaced: 80,
			data: [],
			color: '#000',
			lineColor: '#000',
			lineSize: '20px',
			textColor: '#000',
			textSize: '20px',
			animated: false,
			duration: 500,
			delay: 100,
			after: function() {}
		}, k;
	for (k in opts) _opts[k] = opts[k];

	var parent = _opts.parent,
		width = _opts.width,
		barWidth = _opts.barWidth,
		spacedWidth = _opts.spacedWidth,
		topSpaced = _opts.topSpaced,
		leftSpaced = _opts.leftSpaced,
		data = _opts.data,
		dataLen = data.length,
		color = _opts.color,
		lineColor = _opts.lineColor,
		lineSize = _opts.lineSize,
		textColor = _opts.textColor,
		textSize = _opts.textSize,
		maxValue = 100000,
		mean = 10000,
		arr = [],
		metaData = null,
		i = 0,
		ctxWidth = width,
		ctxHeight = (barWidth + spacedWidth) * dataLen + topSpaced * 2,
		meanWidth = 0,
		animated = _opts.animated,
		duration = _opts.duration,
		delay = _opts.delay,
		after = _opts.after,
		c = document.createElement('canvas'),
		ctx = null;

	parent.appendChild(c);
	ctx = c.getContext("2d");
	ctx.canvas.width = ctxWidth;
	ctx.canvas.height = ctxHeight;

	for (i = 0; i < dataLen; i++) {
		arr.push(parseInt(data[i].amount));
	}
	maxValue = Math.max.apply(null, arr)

	if (maxValue < 10000) mean = 1000;
	if (maxValue >= 10000 && maxValue < 50000) mean = 5000;
	if (maxValue >= 50000 && maxValue < 100000) mean = 10000;

	if (maxValue >= 100000 && maxValue < 150000) mean = 15000;
	if (maxValue >= 150000 && maxValue < 200000) mean = 20000;
	if (maxValue >= 200000 && maxValue < 300000) mean = 30000;
	if (maxValue >= 300000 && maxValue < 500000) mean = 50000;
	if (maxValue >= 500000 && maxValue < 1000000) mean = 100000;

	if (maxValue >= 1000000 && maxValue < 1500000) mean = 150000;
	if (maxValue >= 1500000 && maxValue < 2000000) mean = 200000;
	if (maxValue >= 2000000 && maxValue < 3000000) mean = 300000;
	if (maxValue >= 3000000 && maxValue < 5000000) mean = 500000;
	if (maxValue >= 5000000 && maxValue < 10000000) mean = 1000000;

	if (maxValue >= 10000000 && maxValue < 15000000) mean = 1500000;
	if (maxValue >= 15000000 && maxValue < 20000000) mean = 2000000;
	if (maxValue >= 20000000 && maxValue < 30000000) mean = 3000000;
	if (maxValue >= 30000000 && maxValue < 50000000) mean = 5000000;
	if (maxValue >= 50000000 && maxValue < 100000000) mean = 10000000;

	meanWidth = Math.ceil((ctxWidth - leftSpaced * 2) / 11) + 5;

	function fillLine(x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = lineColor;
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	function fillText(text, x, y) {
		ctx.font = lineSize + ' Arial';
		ctx.fillStyle = lineColor;
		ctx.textAlign = 'end';
		ctx.fillText(text, x, y);
	}

	// Y
	fillLine(leftSpaced, ctxHeight, leftSpaced, topSpaced);

	// X
	fillLine(leftSpaced, topSpaced, ctxWidth, topSpaced);

	//X刻度
	for (i = 0; i < 6; i++) {
		fillLine(meanWidth * i * 2 + leftSpaced, topSpaced - 1, meanWidth * i * 2 + leftSpaced, topSpaced - 8);
		fillText(mean * i * 2, meanWidth * i * 2 + leftSpaced + 5, topSpaced - 10);
	}

	function drawBar(opts) {
		opts = opts || {};
		var left = opts.left,
			top = opts.top,
			width = opts.width,
			height = opts.height,
			color = opts.color || '#f30',
			time = opts.time || 0,
			after = opts.after || function() {};

		function clearFill() {
			ctx.clearRect(left, top, width, height);
		}

		function fillBar(v) {
			ctx.beginPath();
			ctx.lineWidth = height;
			ctx.strokeStyle = color;
			ctx.moveTo(left, top + height / 2);
			ctx.lineTo(v, top + height / 2);
			ctx.stroke();
		}

		function fill(v) {
			clearFill();
			fillBar(v)
		}

		!function animate() {
			var start = left,
				end = width + left,
				change = end - start,
				duration = time,
				startTime = +new Date();
			!function _animate() {
				var nowTime = +new Date(),
					timestamp = nowTime - startTime,
					delta = timestamp / duration,
					length = start + delta * change;
				length > end && (length = end);
				fill(length);
				if (duration <= timestamp) {
					fill(end);
					after && after();
				} else {
					setTimeout(_animate, 17);
				}
			}();
		}();
	}

	function fillRank(text, x, y) {
		ctx.font = textSize + ' Arial';
		ctx.fillStyle = textColor;
		ctx.textAlign = 'start';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, x, y);
	}

	function fillName(text, x, y) {
		ctx.font = textSize + ' Arial';
		ctx.fillStyle = textColor;
		ctx.textAlign = 'end';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, x, y);
	}

	function fill(i) {
		metaData = data[i];
		var m = metaData.amount,
			n = metaData.name,
			t = topSpaced + (barWidth + spacedWidth) * i + spacedWidth,
			w = meanWidth * parseInt(m) / mean,
			x = w + leftSpaced + 5,
			y = t + barWidth / 2;
		drawBar({
			left: leftSpaced + 1,
			top: t,
			width: w,
			height: barWidth,
			color: color,
			time: duration,
			after: function() {
				fillRank(m, x, y);
				if (i === dataLen - 1) after && after();
			}
		});
		fillName(n, leftSpaced - 5, y);
	}

	if (!animated) {
		duration = 0;
		delay = 0;
	}

	for (i = 0; i < dataLen; i++) {
		(function(i) {
			setTimeout(function() {
				fill(i);
			}, delay * i);
		}(i));
	}
}