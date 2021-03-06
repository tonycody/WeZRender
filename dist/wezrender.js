(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	var core = {
		bbox             :     __webpack_require__(1),
	};
	
	var container = {
		Group            :     __webpack_require__(4),
	}
	
	var shape = {
	    Arc             :     __webpack_require__(19),
	    BezierCurve     :     __webpack_require__(34),
	    Circle          :     __webpack_require__(35),
	    Droplet         :     __webpack_require__(36),
	    Ellipse         :     __webpack_require__(37),
	    Heart           :     __webpack_require__(38),
	    Isogon          :     __webpack_require__(39),
	    Line            :     __webpack_require__(40),    
	    Polyline        :     __webpack_require__(41),
	    Polygon         :     __webpack_require__(45),
	    Rect            :     __webpack_require__(46),
	    Ring            :     __webpack_require__(48),
	    Rose            :     __webpack_require__(49),
	    Sector          :     __webpack_require__(50),
	    Star            :     __webpack_require__(51),
	    Trochoid        :     __webpack_require__(52)
	};
	
	
	
	var graphic = {
		
	    shape           :     shape,
	
	    Path        	:     __webpack_require__(20),    
	
	    Gradient        :     __webpack_require__(53),    
	    LinearGradient  :     __webpack_require__(54),   
	    RadialGradient  :     __webpack_require__(55),   
	
	    Text            :     __webpack_require__(56),
		Image           :     __webpack_require__(57),
	}
	
	var animation = {
	    Animation       :     __webpack_require__(58),    
	}
	
	module.exports = {
	    zrender         :     __webpack_require__(61),
		
		core			:     core,
		container		:     container,
	
	    graphic         :     graphic
	    
	    
	 
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Yi Shen(https://github.com/pissang)
	 */
	
	
	    var vec2 = __webpack_require__(2);
	    var curve = __webpack_require__(3);
	
	    var bbox = {};
	    var mathMin = Math.min;
	    var mathMax = Math.max;
	    var mathSin = Math.sin;
	    var mathCos = Math.cos;
	
	    var start = vec2.create();
	    var end = vec2.create();
	    var extremity = vec2.create();
	
	    var PI2 = Math.PI * 2;
	    /**
	     * 从顶点数组中计算出最小包围盒，写入`min`和`max`中
	     * @module zrender/core/bbox
	     * @param {Array<Object>} points 顶点数组
	     * @param {number} min
	     * @param {number} max
	     */
	    bbox.fromPoints = function(points, min, max) {
	        if (points.length === 0) {
	            return;
	        }
	        var p = points[0];
	        var left = p[0];
	        var right = p[0];
	        var top = p[1];
	        var bottom = p[1];
	        var i;
	
	        for (i = 1; i < points.length; i++) {
	            p = points[i];
	            left = mathMin(left, p[0]);
	            right = mathMax(right, p[0]);
	            top = mathMin(top, p[1]);
	            bottom = mathMax(bottom, p[1]);
	        }
	
	        min[0] = left;
	        min[1] = top;
	        max[0] = right;
	        max[1] = bottom;
	    };
	
	    /**
	     * @memberOf module:zrender/core/bbox
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {Array.<number>} min
	     * @param {Array.<number>} max
	     */
	    bbox.fromLine = function (x0, y0, x1, y1, min, max) {
	        min[0] = mathMin(x0, x1);
	        min[1] = mathMin(y0, y1);
	        max[0] = mathMax(x0, x1);
	        max[1] = mathMax(y0, y1);
	    };
	
	    var xDim = [];
	    var yDim = [];
	    /**
	     * 从三阶贝塞尔曲线(p0, p1, p2, p3)中计算出最小包围盒，写入`min`和`max`中
	     * @memberOf module:zrender/core/bbox
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {number} x3
	     * @param {number} y3
	     * @param {Array.<number>} min
	     * @param {Array.<number>} max
	     */
	    bbox.fromCubic = function(
	        x0, y0, x1, y1, x2, y2, x3, y3, min, max
	    ) {
	        var cubicExtrema = curve.cubicExtrema;
	        var cubicAt = curve.cubicAt;
	        var i;
	        var n = cubicExtrema(x0, x1, x2, x3, xDim);
	        min[0] = Infinity;
	        min[1] = Infinity;
	        max[0] = -Infinity;
	        max[1] = -Infinity;
	
	        for (i = 0; i < n; i++) {
	            var x = cubicAt(x0, x1, x2, x3, xDim[i]);
	            min[0] = mathMin(x, min[0]);
	            max[0] = mathMax(x, max[0]);
	        }
	        n = cubicExtrema(y0, y1, y2, y3, yDim);
	        for (i = 0; i < n; i++) {
	            var y = cubicAt(y0, y1, y2, y3, yDim[i]);
	            min[1] = mathMin(y, min[1]);
	            max[1] = mathMax(y, max[1]);
	        }
	
	        min[0] = mathMin(x0, min[0]);
	        max[0] = mathMax(x0, max[0]);
	        min[0] = mathMin(x3, min[0]);
	        max[0] = mathMax(x3, max[0]);
	
	        min[1] = mathMin(y0, min[1]);
	        max[1] = mathMax(y0, max[1]);
	        min[1] = mathMin(y3, min[1]);
	        max[1] = mathMax(y3, max[1]);
	    };
	
	    /**
	     * 从二阶贝塞尔曲线(p0, p1, p2)中计算出最小包围盒，写入`min`和`max`中
	     * @memberOf module:zrender/core/bbox
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {Array.<number>} min
	     * @param {Array.<number>} max
	     */
	    bbox.fromQuadratic = function(x0, y0, x1, y1, x2, y2, min, max) {
	        var quadraticExtremum = curve.quadraticExtremum;
	        var quadraticAt = curve.quadraticAt;
	        // Find extremities, where derivative in x dim or y dim is zero
	        var tx =
	            mathMax(
	                mathMin(quadraticExtremum(x0, x1, x2), 1), 0
	            );
	        var ty =
	            mathMax(
	                mathMin(quadraticExtremum(y0, y1, y2), 1), 0
	            );
	
	        var x = quadraticAt(x0, x1, x2, tx);
	        var y = quadraticAt(y0, y1, y2, ty);
	
	        min[0] = mathMin(x0, x2, x);
	        min[1] = mathMin(y0, y2, y);
	        max[0] = mathMax(x0, x2, x);
	        max[1] = mathMax(y0, y2, y);
	    };
	
	    /**
	     * 从圆弧中计算出最小包围盒，写入`min`和`max`中
	     * @method
	     * @memberOf module:zrender/core/bbox
	     * @param {number} x
	     * @param {number} y
	     * @param {number} rx
	     * @param {number} ry
	     * @param {number} startAngle
	     * @param {number} endAngle
	     * @param {number} anticlockwise
	     * @param {Array.<number>} min
	     * @param {Array.<number>} max
	     */
	    bbox.fromArc = function (
	        x, y, rx, ry, startAngle, endAngle, anticlockwise, min, max
	    ) {
	        var vec2Min = vec2.min;
	        var vec2Max = vec2.max;
	
	        var diff = Math.abs(startAngle - endAngle);
	
	
	        if (diff % PI2 < 1e-4 && diff > 1e-4) {
	            // Is a circle
	            min[0] = x - rx;
	            min[1] = y - ry;
	            max[0] = x + rx;
	            max[1] = y + ry;
	            return;
	        }
	
	        start[0] = mathCos(startAngle) * rx + x;
	        start[1] = mathSin(startAngle) * ry + y;
	
	        end[0] = mathCos(endAngle) * rx + x;
	        end[1] = mathSin(endAngle) * ry + y;
	
	        vec2Min(min, start, end);
	        vec2Max(max, start, end);
	
	        // Thresh to [0, Math.PI * 2]
	        startAngle = startAngle % (PI2);
	        if (startAngle < 0) {
	            startAngle = startAngle + PI2;
	        }
	        endAngle = endAngle % (PI2);
	        if (endAngle < 0) {
	            endAngle = endAngle + PI2;
	        }
	
	        if (startAngle > endAngle && !anticlockwise) {
	            endAngle += PI2;
	        }
	        else if (startAngle < endAngle && anticlockwise) {
	            startAngle += PI2;
	        }
	        if (anticlockwise) {
	            var tmp = endAngle;
	            endAngle = startAngle;
	            startAngle = tmp;
	        }
	
	        // var number = 0;
	        // var step = (anticlockwise ? -Math.PI : Math.PI) / 2;
	        for (var angle = 0; angle < endAngle; angle += Math.PI / 2) {
	            if (angle > startAngle) {
	                extremity[0] = mathCos(angle) * rx + x;
	                extremity[1] = mathSin(angle) * ry + y;
	
	                vec2Min(min, extremity, min);
	                vec2Max(max, extremity, max);
	            }
	        }
	    };
	
	    module.exports = bbox;
	


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	    var ArrayCtor = typeof Float32Array === 'undefined'
	        ? Array
	        : Float32Array;
	
	    /**
	     * @typedef {Float32Array|Array.<number>} Vector2
	     */
	    /**
	     * 二维向量类
	     * @exports zrender/tool/vector
	     */
	    var vector = {
	        /**
	         * 创建一个向量
	         * @param {number} [x=0]
	         * @param {number} [y=0]
	         * @return {Vector2}
	         */
	        create: function (x, y) {
	            var out = new ArrayCtor(2);
	            if (x == null) {
	                x = 0;
	            }
	            if (y == null) {
	                y = 0;
	            }
	            out[0] = x;
	            out[1] = y;
	            return out;
	        },
	
	        /**
	         * 复制向量数据
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @return {Vector2}
	         */
	        copy: function (out, v) {
	            out[0] = v[0];
	            out[1] = v[1];
	            return out;
	        },
	
	        /**
	         * 克隆一个向量
	         * @param {Vector2} v
	         * @return {Vector2}
	         */
	        clone: function (v) {
	            var out = new ArrayCtor(2);
	            out[0] = v[0];
	            out[1] = v[1];
	            return out;
	        },
	
	        /**
	         * 设置向量的两个项
	         * @param {Vector2} out
	         * @param {number} a
	         * @param {number} b
	         * @return {Vector2} 结果
	         */
	        set: function (out, a, b) {
	            out[0] = a;
	            out[1] = b;
	            return out;
	        },
	
	        /**
	         * 向量相加
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        add: function (out, v1, v2) {
	            out[0] = v1[0] + v2[0];
	            out[1] = v1[1] + v2[1];
	            return out;
	        },
	
	        /**
	         * 向量缩放后相加
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @param {number} a
	         */
	        scaleAndAdd: function (out, v1, v2, a) {
	            out[0] = v1[0] + v2[0] * a;
	            out[1] = v1[1] + v2[1] * a;
	            return out;
	        },
	
	        /**
	         * 向量相减
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        sub: function (out, v1, v2) {
	            out[0] = v1[0] - v2[0];
	            out[1] = v1[1] - v2[1];
	            return out;
	        },
	
	        /**
	         * 向量长度
	         * @param {Vector2} v
	         * @return {number}
	         */
	        len: function (v) {
	            return Math.sqrt(this.lenSquare(v));
	        },
	
	        /**
	         * 向量长度平方
	         * @param {Vector2} v
	         * @return {number}
	         */
	        lenSquare: function (v) {
	            return v[0] * v[0] + v[1] * v[1];
	        },
	
	        /**
	         * 向量乘法
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        mul: function (out, v1, v2) {
	            out[0] = v1[0] * v2[0];
	            out[1] = v1[1] * v2[1];
	            return out;
	        },
	
	        /**
	         * 向量除法
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        div: function (out, v1, v2) {
	            out[0] = v1[0] / v2[0];
	            out[1] = v1[1] / v2[1];
	            return out;
	        },
	
	        /**
	         * 向量点乘
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        dot: function (v1, v2) {
	            return v1[0] * v2[0] + v1[1] * v2[1];
	        },
	
	        /**
	         * 向量缩放
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @param {number} s
	         */
	        scale: function (out, v, s) {
	            out[0] = v[0] * s;
	            out[1] = v[1] * s;
	            return out;
	        },
	
	        /**
	         * 向量归一化
	         * @param {Vector2} out
	         * @param {Vector2} v
	         */
	        normalize: function (out, v) {
	            var d = vector.len(v);
	            if (d === 0) {
	                out[0] = 0;
	                out[1] = 0;
	            }
	            else {
	                out[0] = v[0] / d;
	                out[1] = v[1] / d;
	            }
	            return out;
	        },
	
	        /**
	         * 计算向量间距离
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        distance: function (v1, v2) {
	            return Math.sqrt(
	                (v1[0] - v2[0]) * (v1[0] - v2[0])
	                + (v1[1] - v2[1]) * (v1[1] - v2[1])
	            );
	        },
	
	        /**
	         * 向量距离平方
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        distanceSquare: function (v1, v2) {
	            return (v1[0] - v2[0]) * (v1[0] - v2[0])
	                + (v1[1] - v2[1]) * (v1[1] - v2[1]);
	        },
	
	        /**
	         * 求负向量
	         * @param {Vector2} out
	         * @param {Vector2} v
	         */
	        negate: function (out, v) {
	            out[0] = -v[0];
	            out[1] = -v[1];
	            return out;
	        },
	
	        /**
	         * 插值两个点
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @param {number} t
	         */
	        lerp: function (out, v1, v2, t) {
	            out[0] = v1[0] + t * (v2[0] - v1[0]);
	            out[1] = v1[1] + t * (v2[1] - v1[1]);
	            return out;
	        },
	
	        /**
	         * 矩阵左乘向量
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @param {Vector2} m
	         */
	        applyTransform: function (out, v, m) {
	            var x = v[0];
	            var y = v[1];
	            out[0] = m[0] * x + m[2] * y + m[4];
	            out[1] = m[1] * x + m[3] * y + m[5];
	            return out;
	        },
	        /**
	         * 求两个向量最小值
	         * @param  {Vector2} out
	         * @param  {Vector2} v1
	         * @param  {Vector2} v2
	         */
	        min: function (out, v1, v2) {
	            out[0] = Math.min(v1[0], v2[0]);
	            out[1] = Math.min(v1[1], v2[1]);
	            return out;
	        },
	        /**
	         * 求两个向量最大值
	         * @param  {Vector2} out
	         * @param  {Vector2} v1
	         * @param  {Vector2} v2
	         */
	        max: function (out, v1, v2) {
	            out[0] = Math.max(v1[0], v2[0]);
	            out[1] = Math.max(v1[1], v2[1]);
	            return out;
	        }
	    };
	
	    vector.length = vector.len;
	    vector.lengthSquare = vector.lenSquare;
	    vector.dist = vector.distance;
	    vector.distSquare = vector.distanceSquare;
	
	    module.exports = vector;
	


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 曲线辅助模块
	 * @module zrender/core/curve
	 * @author pissang(https://www.github.com/pissang)
	 */
	
	
	    var vec2 = __webpack_require__(2);
	    var v2Create = vec2.create;
	    var v2DistSquare = vec2.distSquare;
	    var mathPow = Math.pow;
	    var mathSqrt = Math.sqrt;
	
	    var EPSILON = 1e-8;
	    var EPSILON_NUMERIC = 1e-4;
	
	    var THREE_SQRT = mathSqrt(3);
	    var ONE_THIRD = 1 / 3;
	
	    // 临时变量
	    var _v0 = v2Create();
	    var _v1 = v2Create();
	    var _v2 = v2Create();
	    // var _v3 = vec2.create();
	
	    function isAroundZero(val) {
	        return val > -EPSILON && val < EPSILON;
	    }
	    function isNotAroundZero(val) {
	        return val > EPSILON || val < -EPSILON;
	    }
	    /**
	     * 计算三次贝塞尔值
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @return {number}
	     */
	    function cubicAt(p0, p1, p2, p3, t) {
	        var onet = 1 - t;
	        return onet * onet * (onet * p0 + 3 * t * p1)
	             + t * t * (t * p3 + 3 * onet * p2);
	    }
	
	    /**
	     * 计算三次贝塞尔导数值
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @return {number}
	     */
	    function cubicDerivativeAt(p0, p1, p2, p3, t) {
	        var onet = 1 - t;
	        return 3 * (
	            ((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet
	            + (p3 - p2) * t * t
	        );
	    }
	
	    /**
	     * 计算三次贝塞尔方程根，使用盛金公式
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} val
	     * @param  {Array.<number>} roots
	     * @return {number} 有效根数目
	     */
	    function cubicRootAt(p0, p1, p2, p3, val, roots) {
	        // Evaluate roots of cubic functions
	        var a = p3 + 3 * (p1 - p2) - p0;
	        var b = 3 * (p2 - p1 * 2 + p0);
	        var c = 3 * (p1  - p0);
	        var d = p0 - val;
	
	        var A = b * b - 3 * a * c;
	        var B = b * c - 9 * a * d;
	        var C = c * c - 3 * b * d;
	
	        var n = 0;
	
	        if (isAroundZero(A) && isAroundZero(B)) {
	            if (isAroundZero(b)) {
	                roots[0] = 0;
	            }
	            else {
	                var t1 = -c / b;  //t1, t2, t3, b is not zero
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = B * B - 4 * A * C;
	
	            if (isAroundZero(disc)) {
	                var K = B / A;
	                var t1 = -b / a + K;  // t1, a is not zero
	                var t2 = -K / 2;  // t2, t3
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	            }
	            else if (disc > 0) {
	                var discSqrt = mathSqrt(disc);
	                var Y1 = A * b + 1.5 * a * (-B + discSqrt);
	                var Y2 = A * b + 1.5 * a * (-B - discSqrt);
	                if (Y1 < 0) {
	                    Y1 = -mathPow(-Y1, ONE_THIRD);
	                }
	                else {
	                    Y1 = mathPow(Y1, ONE_THIRD);
	                }
	                if (Y2 < 0) {
	                    Y2 = -mathPow(-Y2, ONE_THIRD);
	                }
	                else {
	                    Y2 = mathPow(Y2, ONE_THIRD);
	                }
	                var t1 = (-b - (Y1 + Y2)) / (3 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	            else {
	                var T = (2 * A * b - 3 * a * B) / (2 * mathSqrt(A * A * A));
	                var theta = Math.acos(T) / 3;
	                var ASqrt = mathSqrt(A);
	                var tmp = Math.cos(theta);
	
	                var t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
	                var t2 = (-b + ASqrt * (tmp + THREE_SQRT * Math.sin(theta))) / (3 * a);
	                var t3 = (-b + ASqrt * (tmp - THREE_SQRT * Math.sin(theta))) / (3 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	                if (t3 >= 0 && t3 <= 1) {
	                    roots[n++] = t3;
	                }
	            }
	        }
	        return n;
	    }
	
	    /**
	     * 计算三次贝塞尔方程极限值的位置
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {Array.<number>} extrema
	     * @return {number} 有效数目
	     */
	    function cubicExtrema(p0, p1, p2, p3, extrema) {
	        var b = 6 * p2 - 12 * p1 + 6 * p0;
	        var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
	        var c = 3 * p1 - 3 * p0;
	
	        var n = 0;
	        if (isAroundZero(a)) {
	            if (isNotAroundZero(b)) {
	                var t1 = -c / b;
	                if (t1 >= 0 && t1 <=1) {
	                    extrema[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = b * b - 4 * a * c;
	            if (isAroundZero(disc)) {
	                extrema[0] = -b / (2 * a);
	            }
	            else if (disc > 0) {
	                var discSqrt = mathSqrt(disc);
	                var t1 = (-b + discSqrt) / (2 * a);
	                var t2 = (-b - discSqrt) / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    extrema[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    extrema[n++] = t2;
	                }
	            }
	        }
	        return n;
	    }
	
	    /**
	     * 细分三次贝塞尔曲线
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @param  {Array.<number>} out
	     */
	    function cubicSubdivide(p0, p1, p2, p3, t, out) {
	        var p01 = (p1 - p0) * t + p0;
	        var p12 = (p2 - p1) * t + p1;
	        var p23 = (p3 - p2) * t + p2;
	
	        var p012 = (p12 - p01) * t + p01;
	        var p123 = (p23 - p12) * t + p12;
	
	        var p0123 = (p123 - p012) * t + p012;
	        // Seg0
	        out[0] = p0;
	        out[1] = p01;
	        out[2] = p012;
	        out[3] = p0123;
	        // Seg1
	        out[4] = p0123;
	        out[5] = p123;
	        out[6] = p23;
	        out[7] = p3;
	    }
	
	    /**
	     * 投射点到三次贝塞尔曲线上，返回投射距离。
	     * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {number} x3
	     * @param {number} y3
	     * @param {number} x
	     * @param {number} y
	     * @param {Array.<number>} [out] 投射点
	     * @return {number}
	     */
	    function cubicProjectPoint(
	        x0, y0, x1, y1, x2, y2, x3, y3,
	        x, y, out
	    ) {
	        // http://pomax.github.io/bezierinfo/#projections
	        var t;
	        var interval = 0.005;
	        var d = Infinity;
	        var prev;
	        var next;
	        var d1;
	        var d2;
	
	        _v0[0] = x;
	        _v0[1] = y;
	
	        // 先粗略估计一下可能的最小距离的 t 值
	        // PENDING
	        for (var _t = 0; _t < 1; _t += 0.05) {
	            _v1[0] = cubicAt(x0, x1, x2, x3, _t);
	            _v1[1] = cubicAt(y0, y1, y2, y3, _t);
	            d1 = v2DistSquare(_v0, _v1);
	            if (d1 < d) {
	                t = _t;
	                d = d1;
	            }
	        }
	        d = Infinity;
	
	        // At most 32 iteration
	        for (var i = 0; i < 32; i++) {
	            if (interval < EPSILON_NUMERIC) {
	                break;
	            }
	            prev = t - interval;
	            next = t + interval;
	            // t - interval
	            _v1[0] = cubicAt(x0, x1, x2, x3, prev);
	            _v1[1] = cubicAt(y0, y1, y2, y3, prev);
	
	            d1 = v2DistSquare(_v1, _v0);
	
	            if (prev >= 0 && d1 < d) {
	                t = prev;
	                d = d1;
	            }
	            else {
	                // t + interval
	                _v2[0] = cubicAt(x0, x1, x2, x3, next);
	                _v2[1] = cubicAt(y0, y1, y2, y3, next);
	                d2 = v2DistSquare(_v2, _v0);
	
	                if (next <= 1 && d2 < d) {
	                    t = next;
	                    d = d2;
	                }
	                else {
	                    interval *= 0.5;
	                }
	            }
	        }
	        // t
	        if (out) {
	            out[0] = cubicAt(x0, x1, x2, x3, t);
	            out[1] = cubicAt(y0, y1, y2, y3, t);
	        }
	        // console.log(interval, i);
	        return mathSqrt(d);
	    }
	
	    /**
	     * 计算二次方贝塞尔值
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @return {number}
	     */
	    function quadraticAt(p0, p1, p2, t) {
	        var onet = 1 - t;
	        return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
	    }
	
	    /**
	     * 计算二次方贝塞尔导数值
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @return {number}
	     */
	    function quadraticDerivativeAt(p0, p1, p2, t) {
	        return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
	    }
	
	    /**
	     * 计算二次方贝塞尔方程根
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @param  {Array.<number>} roots
	     * @return {number} 有效根数目
	     */
	    function quadraticRootAt(p0, p1, p2, val, roots) {
	        var a = p0 - 2 * p1 + p2;
	        var b = 2 * (p1 - p0);
	        var c = p0 - val;
	
	        var n = 0;
	        if (isAroundZero(a)) {
	            if (isNotAroundZero(b)) {
	                var t1 = -c / b;
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = b * b - 4 * a * c;
	            if (isAroundZero(disc)) {
	                var t1 = -b / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	            else if (disc > 0) {
	                var discSqrt = mathSqrt(disc);
	                var t1 = (-b + discSqrt) / (2 * a);
	                var t2 = (-b - discSqrt) / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	            }
	        }
	        return n;
	    }
	
	    /**
	     * 计算二次贝塞尔方程极限值
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @return {number}
	     */
	    function quadraticExtremum(p0, p1, p2) {
	        var divider = p0 + p2 - 2 * p1;
	        if (divider === 0) {
	            // p1 is center of p0 and p2
	            return 0.5;
	        }
	        else {
	            return (p0 - p1) / divider;
	        }
	    }
	
	    /**
	     * 细分二次贝塞尔曲线
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @param  {Array.<number>} out
	     */
	    function quadraticSubdivide(p0, p1, p2, t, out) {
	        var p01 = (p1 - p0) * t + p0;
	        var p12 = (p2 - p1) * t + p1;
	        var p012 = (p12 - p01) * t + p01;
	
	        // Seg0
	        out[0] = p0;
	        out[1] = p01;
	        out[2] = p012;
	
	        // Seg1
	        out[3] = p012;
	        out[4] = p12;
	        out[5] = p2;
	    }
	
	    /**
	     * 投射点到二次贝塞尔曲线上，返回投射距离。
	     * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {number} x
	     * @param {number} y
	     * @param {Array.<number>} out 投射点
	     * @return {number}
	     */
	    function quadraticProjectPoint(
	        x0, y0, x1, y1, x2, y2,
	        x, y, out
	    ) {
	        // http://pomax.github.io/bezierinfo/#projections
	        var t;
	        var interval = 0.005;
	        var d = Infinity;
	
	        _v0[0] = x;
	        _v0[1] = y;
	
	        // 先粗略估计一下可能的最小距离的 t 值
	        // PENDING
	        for (var _t = 0; _t < 1; _t += 0.05) {
	            _v1[0] = quadraticAt(x0, x1, x2, _t);
	            _v1[1] = quadraticAt(y0, y1, y2, _t);
	            var d1 = v2DistSquare(_v0, _v1);
	            if (d1 < d) {
	                t = _t;
	                d = d1;
	            }
	        }
	        d = Infinity;
	
	        // At most 32 iteration
	        for (var i = 0; i < 32; i++) {
	            if (interval < EPSILON_NUMERIC) {
	                break;
	            }
	            var prev = t - interval;
	            var next = t + interval;
	            // t - interval
	            _v1[0] = quadraticAt(x0, x1, x2, prev);
	            _v1[1] = quadraticAt(y0, y1, y2, prev);
	
	            var d1 = v2DistSquare(_v1, _v0);
	
	            if (prev >= 0 && d1 < d) {
	                t = prev;
	                d = d1;
	            }
	            else {
	                // t + interval
	                _v2[0] = quadraticAt(x0, x1, x2, next);
	                _v2[1] = quadraticAt(y0, y1, y2, next);
	                var d2 = v2DistSquare(_v2, _v0);
	                if (next <= 1 && d2 < d) {
	                    t = next;
	                    d = d2;
	                }
	                else {
	                    interval *= 0.5;
	                }
	            }
	        }
	        // t
	        if (out) {
	            out[0] = quadraticAt(x0, x1, x2, t);
	            out[1] = quadraticAt(y0, y1, y2, t);
	        }
	        // console.log(interval, i);
	        return mathSqrt(d);
	    }
	
	    module.exports = {
	
	        cubicAt: cubicAt,
	
	        cubicDerivativeAt: cubicDerivativeAt,
	
	        cubicRootAt: cubicRootAt,
	
	        cubicExtrema: cubicExtrema,
	
	        cubicSubdivide: cubicSubdivide,
	
	        cubicProjectPoint: cubicProjectPoint,
	
	        quadraticAt: quadraticAt,
	
	        quadraticDerivativeAt: quadraticDerivativeAt,
	
	        quadraticRootAt: quadraticRootAt,
	
	        quadraticExtremum: quadraticExtremum,
	
	        quadraticSubdivide: quadraticSubdivide,
	
	        quadraticProjectPoint: quadraticProjectPoint
	    };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Group是一个容器，可以插入子节点，Group的变换也会被应用到子节点上
	 * @module zrender/graphic/Group
	 * @example
	 *     var Group = require('zrender/lib/container/Group');
	 *     var Circle = require('zrender/lib/graphic/shape/Circle');
	 *     var g = new Group();
	 *     g.position[0] = 100;
	 *     g.position[1] = 100;
	 *     g.add(new Circle({
	 *         style: {
	 *             x: 100,
	 *             y: 100,
	 *             r: 20,
	 *         }
	 *     }));
	 *     zr.add(g);
	 */
	
	
	    var zrUtil = __webpack_require__(5);
	    var Element = __webpack_require__(6);
	    var BoundingRect = __webpack_require__(18);
	
	    /**
	     * @alias module:zrender/graphic/Group
	     * @constructor
	     * @extends module:zrender/mixin/Transformable
	     * @extends module:zrender/mixin/Eventful
	     */
	    var Group = function (opts) {
	
	        opts = opts || {};
	
	        Element.call(this, opts);
	
	        for (var key in opts) {
	            if (opts.hasOwnProperty(key)) {
	                this[key] = opts[key];
	            }
	        }
	
	        this._children = [];
	
	        this.__storage = null;
	
	        this.__dirty = true;
	    };
	
	    Group.prototype = {
	
	        constructor: Group,
	
	        isGroup: true,
	
	        /**
	         * @type {string}
	         */
	        type: 'group',
	
	        /**
	         * 所有子孙元素是否响应鼠标事件
	         * @name module:/zrender/container/Group#silent
	         * @type {boolean}
	         * @default false
	         */
	        silent: false,
	
	        /**
	         * @return {Array.<module:zrender/Element>}
	         */
	        children: function () {
	            return this._children.slice();
	        },
	
	        /**
	         * 获取指定 index 的儿子节点
	         * @param  {number} idx
	         * @return {module:zrender/Element}
	         */
	        childAt: function (idx) {
	            return this._children[idx];
	        },
	
	        /**
	         * 获取指定名字的儿子节点
	         * @param  {string} name
	         * @return {module:zrender/Element}
	         */
	        childOfName: function (name) {
	            var children = this._children;
	            for (var i = 0; i < children.length; i++) {
	                if (children[i].name === name) {
	                    return children[i];
	                }
	             }
	        },
	
	        /**
	         * @return {number}
	         */
	        childCount: function () {
	            return this._children.length;
	        },
	
	        /**
	         * 添加子节点到最后
	         * @param {module:zrender/Element} child
	         */
	        add: function (child) {
	            if (child && child !== this && child.parent !== this) {
	
	                this._children.push(child);
	
	                this._doAdd(child);
	            }
	
	            return this;
	        },
	
	        /**
	         * 添加子节点在 nextSibling 之前
	         * @param {module:zrender/Element} child
	         * @param {module:zrender/Element} nextSibling
	         */
	        addBefore: function (child, nextSibling) {
	            if (child && child !== this && child.parent !== this
	                && nextSibling && nextSibling.parent === this) {
	
	                var children = this._children;
	                var idx = children.indexOf(nextSibling);
	
	                if (idx >= 0) {
	                    children.splice(idx, 0, child);
	                    this._doAdd(child);
	                }
	            }
	
	            return this;
	        },
	
	        _doAdd: function (child) {
	            if (child.parent) {
	                child.parent.remove(child);
	            }
	
	            child.parent = this;
	
	            var storage = this.__storage;
	            var zr = this.__zr;
	            if (storage && storage !== child.__storage) {
	
	                storage.addToMap(child);
	
	                if (child instanceof Group) {
	                    child.addChildrenToStorage(storage);
	                }
	            }
	
	            zr && zr.refresh();
	        },
	
	        /**
	         * 移除子节点
	         * @param {module:zrender/Element} child
	         */
	        remove: function (child) {
	            var zr = this.__zr;
	            var storage = this.__storage;
	            var children = this._children;
	
	            var idx = zrUtil.indexOf(children, child);
	            if (idx < 0) {
	                return this;
	            }
	            children.splice(idx, 1);
	
	            child.parent = null;
	
	            if (storage) {
	
	                storage.delFromMap(child.id);
	
	                if (child instanceof Group) {
	                    child.delChildrenFromStorage(storage);
	                }
	            }
	
	            zr && zr.refresh();
	
	            return this;
	        },
	
	        /**
	         * 移除所有子节点
	         */
	        removeAll: function () {
	            var children = this._children;
	            var storage = this.__storage;
	            var child;
	            var i;
	            for (i = 0; i < children.length; i++) {
	                child = children[i];
	                if (storage) {
	                    storage.delFromMap(child.id);
	                    if (child instanceof Group) {
	                        child.delChildrenFromStorage(storage);
	                    }
	                }
	                child.parent = null;
	            }
	            children.length = 0;
	
	            return this;
	        },
	
	        /**
	         * 遍历所有子节点
	         * @param  {Function} cb
	         * @param  {}   context
	         */
	        eachChild: function (cb, context) {
	            var children = this._children;
	            for (var i = 0; i < children.length; i++) {
	                var child = children[i];
	                cb.call(context, child, i);
	            }
	            return this;
	        },
	
	        /**
	         * 深度优先遍历所有子孙节点
	         * @param  {Function} cb
	         * @param  {}   context
	         */
	        traverse: function (cb, context) {
	            for (var i = 0; i < this._children.length; i++) {
	                var child = this._children[i];
	                cb.call(context, child);
	
	                if (child.type === 'group') {
	                    child.traverse(cb, context);
	                }
	            }
	            return this;
	        },
	
	        addChildrenToStorage: function (storage) {
	            for (var i = 0; i < this._children.length; i++) {
	                var child = this._children[i];
	                storage.addToMap(child);
	                if (child instanceof Group) {
	                    child.addChildrenToStorage(storage);
	                }
	            }
	        },
	
	        delChildrenFromStorage: function (storage) {
	            for (var i = 0; i < this._children.length; i++) {
	                var child = this._children[i];
	                storage.delFromMap(child.id);
	                if (child instanceof Group) {
	                    child.delChildrenFromStorage(storage);
	                }
	            }
	        },
	
	        dirty: function () {
	            this.__dirty = true;
	            this.__zr && this.__zr.refresh();
	            return this;
	        },
	
	        /**
	         * @return {module:zrender/core/BoundingRect}
	         */
	        getBoundingRect: function (includeChildren) {
	            // TODO Caching
	            var rect = null;
	            var tmpRect = new BoundingRect(0, 0, 0, 0);
	            var children = includeChildren || this._children;
	            var tmpMat = [];
	
	            for (var i = 0; i < children.length; i++) {
	                var child = children[i];
	                if (child.ignore || child.invisible) {
	                    continue;
	                }
	
	                var childRect = child.getBoundingRect();
	                var transform = child.getLocalTransform(tmpMat);
	                // TODO
	                // The boundingRect cacluated by transforming original
	                // rect may be bigger than the actual bundingRect when rotation
	                // is used. (Consider a circle rotated aginst its center, where
	                // the actual boundingRect should be the same as that not be
	                // rotated.) But we can not find better approach to calculate
	                // actual boundingRect yet, considering performance.
	                if (transform) {
	                    tmpRect.copy(childRect);
	                    tmpRect.applyTransform(transform);
	                    rect = rect || tmpRect.clone();
	                    rect.union(tmpRect);
	                }
	                else {
	                    rect = rect || childRect.clone();
	                    rect.union(childRect);
	                }
	            }
	            return rect || tmpRect;
	        }
	    };
	
	    zrUtil.inherits(Group, Element);
	
	    module.exports = Group;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * @module zrender/core/util
	 */
	
	
	    // 用于处理merge时无法遍历Date等对象的问题
	    var BUILTIN_OBJECT = {
	        '[object Function]': 1,
	        '[object RegExp]': 1,
	        '[object Date]': 1,
	        '[object Error]': 1,
	        '[object CanvasGradient]': 1,
	        '[object CanvasPattern]': 1,
	        // For node-canvas
	        '[object Image]': 1,
	        '[object Canvas]': 1
	    };
	
	    var TYPED_ARRAY = {
	        '[object Int8Array]': 1,
	        '[object Uint8Array]': 1,
	        '[object Uint8ClampedArray]': 1,
	        '[object Int16Array]': 1,
	        '[object Uint16Array]': 1,
	        '[object Int32Array]': 1,
	        '[object Uint32Array]': 1,
	        '[object Float32Array]': 1,
	        '[object Float64Array]': 1
	    };
	
	    var objToString = Object.prototype.toString;
	
	    var arrayProto = Array.prototype;
	    var nativeForEach = arrayProto.forEach;
	    var nativeFilter = arrayProto.filter;
	    var nativeSlice = arrayProto.slice;
	    var nativeMap = arrayProto.map;
	    var nativeReduce = arrayProto.reduce;
	
	    /**
	     * Those data types can be cloned:
	     *     Plain object, Array, TypedArray, number, string, null, undefined.
	     * Those data types will be assgined using the orginal data:
	     *     BUILTIN_OBJECT
	     * Instance of user defined class will be cloned to a plain object, without
	     * properties in prototype.
	     * Other data types is not supported (not sure what will happen).
	     *
	     * Caution: do not support clone Date, for performance consideration.
	     * (There might be a large number of date in `series.data`).
	     * So date should not be modified in and out of echarts.
	     *
	     * @param {*} source
	     * @return {*} new
	     */
	    function clone(source) {
	        if (source == null || typeof source != 'object') {
	            return source;
	        }
	
	        var result = source;
	        var typeStr = objToString.call(source);
	
	        if (typeStr === '[object Array]') {
	            result = [];
	            for (var i = 0, len = source.length; i < len; i++) {
	                result[i] = clone(source[i]);
	            }
	        }
	        else if (TYPED_ARRAY[typeStr]) {
	            result = source.constructor.from(source);
	        }
	        else if (!BUILTIN_OBJECT[typeStr] && !isDom(source)) {
	            result = {};
	            for (var key in source) {
	                if (source.hasOwnProperty(key)) {
	                    result[key] = clone(source[key]);
	                }
	            }
	        }
	
	        return result;
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} target
	     * @param {*} source
	     * @param {boolean} [overwrite=false]
	     */
	    function merge(target, source, overwrite) {
	        // We should escapse that source is string
	        // and enter for ... in ...
	        if (!isObject(source) || !isObject(target)) {
	            return overwrite ? clone(source) : target;
	        }
	
	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                var targetProp = target[key];
	                var sourceProp = source[key];
	
	                if (isObject(sourceProp)
	                    && isObject(targetProp)
	                    && !isArray(sourceProp)
	                    && !isArray(targetProp)
	                    && !isDom(sourceProp)
	                    && !isDom(targetProp)
	                    && !isBuildInObject(sourceProp)
	                    && !isBuildInObject(targetProp)
	                ) {
	                    // 如果需要递归覆盖，就递归调用merge
	                    merge(targetProp, sourceProp, overwrite);
	                }
	                else if (overwrite || !(key in target)) {
	                    // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
	                    // NOTE，在 target[key] 不存在的时候也是直接覆盖
	                    target[key] = clone(source[key], true);
	                }
	            }
	        }
	
	        return target;
	    }
	
	    /**
	     * @param {Array} targetAndSources The first item is target, and the rests are source.
	     * @param {boolean} [overwrite=false]
	     * @return {*} target
	     */
	    function mergeAll(targetAndSources, overwrite) {
	        var result = targetAndSources[0];
	        for (var i = 1, len = targetAndSources.length; i < len; i++) {
	            result = merge(result, targetAndSources[i], overwrite);
	        }
	        return result;
	    }
	
	    /**
	     * @param {*} target
	     * @param {*} source
	     * @memberOf module:zrender/core/util
	     */
	    function extend(target, source) {
	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key];
	            }
	        }
	        return target;
	    }
	
	    /**
	     * @param {*} target
	     * @param {*} source
	     * @param {boolen} [overlay=false]
	     * @memberOf module:zrender/core/util
	     */
	    function defaults(target, source, overlay) {
	        for (var key in source) {
	            if (source.hasOwnProperty(key)
	                && (overlay ? source[key] != null : target[key] == null)
	            ) {
	                target[key] = source[key];
	            }
	        }
	        return target;
	    }
	
	   
	
	    /**
	     * 查询数组中元素的index
	     * @memberOf module:zrender/core/util
	     */
	    function indexOf(array, value) {
	        if (array) {
	            if (array.indexOf) {
	                return array.indexOf(value);
	            }
	            for (var i = 0, len = array.length; i < len; i++) {
	                if (array[i] === value) {
	                    return i;
	                }
	            }
	        }
	        return -1;
	    }
	
	    /**
	     * 构造类继承关系
	     *
	     * @memberOf module:zrender/core/util
	     * @param {Function} clazz 源类
	     * @param {Function} baseClazz 基类
	     */
	    function inherits(clazz, baseClazz) {
	        var clazzPrototype = clazz.prototype;
	        function F() {}
	        F.prototype = baseClazz.prototype;
	        clazz.prototype = new F();
	
	        for (var prop in clazzPrototype) {
	            clazz.prototype[prop] = clazzPrototype[prop];
	        }
	        clazz.prototype.constructor = clazz;
	        clazz.superClass = baseClazz;
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Object|Function} target
	     * @param {Object|Function} sorce
	     * @param {boolean} overlay
	     */
	    function mixin(target, source, overlay) {
	        target = 'prototype' in target ? target.prototype : target;
	        source = 'prototype' in source ? source.prototype : source;
	
	        defaults(target, source, overlay);
	    }
	
	    /**
	     * @param {Array|TypedArray} data
	     */
	    function isArrayLike(data) {
	        if (! data) {
	            return;
	        }
	        if (typeof data == 'string') {
	            return false;
	        }
	        return typeof data.length == 'number';
	    }
	
	    /**
	     * 数组或对象遍历
	     * @memberOf module:zrender/core/util
	     * @param {Object|Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     */
	    function each(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.forEach && obj.forEach === nativeForEach) {
	            obj.forEach(cb, context);
	        }
	        else if (obj.length === +obj.length) {
	            for (var i = 0, len = obj.length; i < len; i++) {
	                cb.call(context, obj[i], i, obj);
	            }
	        }
	        else {
	            for (var key in obj) {
	                if (obj.hasOwnProperty(key)) {
	                    cb.call(context, obj[key], key, obj);
	                }
	            }
	        }
	    }
	
	    /**
	     * 数组映射
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function map(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.map && obj.map === nativeMap) {
	            return obj.map(cb, context);
	        }
	        else {
	            var result = [];
	            for (var i = 0, len = obj.length; i < len; i++) {
	                result.push(cb.call(context, obj[i], i, obj));
	            }
	            return result;
	        }
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {Object} [memo]
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function reduce(obj, cb, memo, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.reduce && obj.reduce === nativeReduce) {
	            return obj.reduce(cb, memo, context);
	        }
	        else {
	            for (var i = 0, len = obj.length; i < len; i++) {
	                memo = cb.call(context, memo, obj[i], i, obj);
	            }
	            return memo;
	        }
	    }
	
	    /**
	     * 数组过滤
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function filter(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.filter && obj.filter === nativeFilter) {
	            return obj.filter(cb, context);
	        }
	        else {
	            var result = [];
	            for (var i = 0, len = obj.length; i < len; i++) {
	                if (cb.call(context, obj[i], i, obj)) {
	                    result.push(obj[i]);
	                }
	            }
	            return result;
	        }
	    }
	
	    /**
	     * 数组项查找
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function find(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        for (var i = 0, len = obj.length; i < len; i++) {
	            if (cb.call(context, obj[i], i, obj)) {
	                return obj[i];
	            }
	        }
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Function} func
	     * @param {*} context
	     * @return {Function}
	     */
	    function bind(func, context) {
	        var args = nativeSlice.call(arguments, 2);
	        return function () {
	            return func.apply(context, args.concat(nativeSlice.call(arguments)));
	        };
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Function} func
	     * @return {Function}
	     */
	    function curry(func) {
	        var args = nativeSlice.call(arguments, 1);
	        return function () {
	            return func.apply(this, args.concat(nativeSlice.call(arguments)));
	        };
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isArray(value) {
	        return objToString.call(value) === '[object Array]';
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isFunction(value) {
	        return typeof value === 'function';
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isString(value) {
	        return objToString.call(value) === '[object String]';
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isObject(value) {
	        // Avoid a V8 JIT bug in Chrome 19-20.
	        // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	        var type = typeof value;
	        return type === 'function' || (!!value && type == 'object');
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isBuildInObject(value) {
	        return !!BUILTIN_OBJECT[objToString.call(value)];
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isDom(value) {
	        return typeof value === 'object'
	            && typeof value.nodeType === 'number'
	            && typeof value.ownerDocument === 'object';
	    }
	
	    /**
	     * If value1 is not null, then return value1, otherwise judget rest of values.
	     * @memberOf module:zrender/core/util
	     * @return {*} Final value
	     */
	    function retrieve(values) {
	        for (var i = 0, len = arguments.length; i < len; i++) {
	            if (arguments[i] != null) {
	                return arguments[i];
	            }
	        }
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Array} arr
	     * @param {number} startIndex
	     * @param {number} endIndex
	     * @return {Array}
	     */
	    function slice() {
	        return Function.call.apply(nativeSlice, arguments);
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {boolean} condition
	     * @param {string} message
	     */
	    function assert(condition, message) {
	        if (!condition) {
	            throw new Error(message);
	        }
	    }
	
	    var util = {
	        inherits: inherits,
	        mixin: mixin,
	        clone: clone,
	        merge: merge,
	        mergeAll: mergeAll,
	        extend: extend,
	        defaults: defaults,
	      
	    
	        indexOf: indexOf,
	        slice: slice,
	        find: find,
	        isArrayLike: isArrayLike,
	        each: each,
	        map: map,
	        reduce: reduce,
	        filter: filter,
	        bind: bind,
	        curry: curry,
	        isArray: isArray,
	        isString: isString,
	        isObject: isObject,
	        isFunction: isFunction,
	        isBuildInObject: isBuildInObject,
	        isDom: isDom,
	        retrieve: retrieve,
	        assert: assert,
	        noop: function () {}
	    };
	    module.exports = util;
	


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @module zrender/Element
	 */
	
	
	    var guid = __webpack_require__(7);
	    var Eventful = __webpack_require__(8);
	    var Transformable = __webpack_require__(9);
	    var Animatable = __webpack_require__(11);
	    var zrUtil = __webpack_require__(5);
	
	    /**
	     * @alias module:zrender/Element
	     * @constructor
	     * @extends {module:zrender/mixin/Animatable}
	     * @extends {module:zrender/mixin/Transformable}
	     * @extends {module:zrender/mixin/Eventful}
	     */
	    var Element = function (opts) {
	
	        Transformable.call(this, opts);
	        Eventful.call(this, opts);
	        Animatable.call(this, opts);
	
	        /**
	         * 画布元素ID
	         * @type {string}
	         */
	        this.id = opts.id || guid();
	    };
	
	    Element.prototype = {
	
	        /**
	         * 元素类型
	         * Element type
	         * @type {string}
	         */
	        type: 'element',
	
	        /**
	         * 元素名字
	         * Element name
	         * @type {string}
	         */
	        name: '',
	
	        /**
	         * ZRender 实例对象，会在 element 添加到 zrender 实例中后自动赋值
	         * ZRender instance will be assigned when element is associated with zrender
	         * @name module:/zrender/Element#__zr
	         * @type {module:zrender/ZRender}
	         */
	        __zr: null,
	
	        /**
	         * 图形是否忽略，为true时忽略图形的绘制以及事件触发
	         * If ignore drawing and events of the element object
	         * @name module:/zrender/Element#ignore
	         * @type {boolean}
	         * @default false
	         */
	        ignore: false,
	
	        /**
	         * 用于裁剪的路径(shape)，所有 Group 内的路径在绘制时都会被这个路径裁剪
	         * 该路径会继承被裁减对象的变换
	         * @type {module:zrender/graphic/Path}
	         * @see http://www.w3.org/TR/2dcontext/#clipping-region
	         * @readOnly
	         */
	        clipPath: null,
	
	        /**
	         * Drift element
	         * @param  {number} dx dx on the global space
	         * @param  {number} dy dy on the global space
	         */
	        drift: function (dx, dy) {
	            switch (this.draggable) {
	                case 'horizontal':
	                    dy = 0;
	                    break;
	                case 'vertical':
	                    dx = 0;
	                    break;
	            }
	
	            var m = this.transform;
	            if (!m) {
	                m = this.transform = [1, 0, 0, 1, 0, 0];
	            }
	            m[4] += dx;
	            m[5] += dy;
	
	            this.decomposeTransform();
	            this.dirty(false);
	        },
	
	        /**
	         * Hook before update
	         */
	        beforeUpdate: function () {},
	        /**
	         * Hook after update
	         */
	        afterUpdate: function () {},
	        /**
	         * Update each frame
	         */
	        update: function () {
	            this.updateTransform();
	        },
	
	        /**
	         * @param  {Function} cb
	         * @param  {}   context
	         */
	        traverse: function (cb, context) {},
	
	        /**
	         * @protected
	         */
	        attrKV: function (key, value) {			
	            if (key === 'position' || key === 'scale' || key === 'origin') {
	                // Copy the array
	                if (value) {
	                    var target = this[key];
	                    if (!target) {
	                        target = this[key] = [];
	                    }
	                    target[0] = value[0];
	                    target[1] = value[1];
	                }
	            }
	            else {
	                this[key] = value;
	            }
	        },
	
	        /**
	         * Hide the element
	         */
	        hide: function () {
	            this.ignore = true;
	            this.__zr && this.__zr.refresh();
	        },
	
	        /**
	         * Show the element
	         */
	        show: function () {
	            this.ignore = false;
	            this.__zr && this.__zr.refresh();
	        },
	
	        /**
	         * @param {string|Object} key
	         * @param {*} value
	         */
	        attr: function (key, value) {
	            if (typeof key === 'string') {
	                this.attrKV(key, value);
	            }
	            else if (zrUtil.isObject(key)) {
	                for (var name in key) {
	                    if (key.hasOwnProperty(name)) {
	                        this.attrKV(name, key[name]);
	                    }
	                }
	            }
	
	            this.dirty(false);
	
	            return this;
	        },
	
	        /**
	         * @param {module:zrender/graphic/Path} clipPath
	         */
	        setClipPath: function (clipPath) {
	            var zr = this.__zr;
	            if (zr) {
	                clipPath.addSelfToZr(zr);
	            }
	
	            // Remove previous clip path
	            if (this.clipPath && this.clipPath !== clipPath) {
	                this.removeClipPath();
	            }
	
	            this.clipPath = clipPath;
	            clipPath.__zr = zr;
	            clipPath.__clipTarget = this;
	
	            this.dirty(false);
	        },
	
	        /**
	         */
	        removeClipPath: function () {
	            var clipPath = this.clipPath;
	            if (clipPath) {
	                if (clipPath.__zr) {
	                    clipPath.removeSelfFromZr(clipPath.__zr);
	                }
	
	                clipPath.__zr = null;
	                clipPath.__clipTarget = null;
	                this.clipPath = null;
	
	                this.dirty(false);
	            }
	        },
	
	        /**
	         * Add self from zrender instance.
	         * Not recursively because it will be invoked when element added to storage.
	         * @param {module:zrender/ZRender} zr
	         */
	        addSelfToZr: function (zr) {
	            this.__zr = zr;
	            // 添加动画
	            var animators = this.animators;
	            if (animators) {
	                for (var i = 0; i < animators.length; i++) {
	                    zr.animation.addAnimator(animators[i]);
	                }
	            }
	
	            if (this.clipPath) {
	                this.clipPath.addSelfToZr(zr);
	            }
	        },
	
	        /**
	         * Remove self from zrender instance.
	         * Not recursively because it will be invoked when element added to storage.
	         * @param {module:zrender/ZRender} zr
	         */
	        removeSelfFromZr: function (zr) {
	            this.__zr = null;
	            // 移除动画
	            var animators = this.animators;
	            if (animators) {
	                for (var i = 0; i < animators.length; i++) {
	                    zr.animation.removeAnimator(animators[i]);
	                }
	            }
	
	            if (this.clipPath) {
	                this.clipPath.removeSelfFromZr(zr);
	            }
	        }
	    };
	
	    zrUtil.mixin(Element, Animatable);
	    zrUtil.mixin(Element, Transformable);
	    zrUtil.mixin(Element, Eventful);
	
	    module.exports = Element;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * zrender: 生成唯一id
	 *
	 * @author errorrik (errorrik@gmail.com)
	 */
	
	
	    var idStart = 0x0907;
	
	    module.exports = function () {
	        return idStart++;
	    };
	


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * 事件扩展
	 * @module zrender/mixin/Eventful
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         pissang (https://www.github.com/pissang)
	 */
	
	
	    var arrySlice = Array.prototype.slice;
	
	    /**
	     * 事件分发器
	     * @alias module:zrender/mixin/Eventful
	     * @constructor
	     */
	    var Eventful = function () {
	        this._$handlers = {};
	    };
	
	    Eventful.prototype = {
	
	        constructor: Eventful,
	
	        /**
	         * 单次触发绑定，trigger后销毁
	         *
	         * @param {string} event 事件名
	         * @param {Function} handler 响应函数
	         * @param {Object} context
	         */
	        one: function (event, handler, context) {
	            var _h = this._$handlers;
	
	            if (!handler || !event) {
	                return this;
	            }
	
	            if (!_h[event]) {
	                _h[event] = [];
	            }
	
	            for (var i = 0; i < _h[event].length; i++) {
	                if (_h[event][i].h === handler) {
	                    return this;
	                }
	            }
	
	            _h[event].push({
	                h: handler,
	                one: true,
	                ctx: context || this
	            });
	
	            return this;
	        },
	
	        /**
	         * 绑定事件
	         * @param {string} event 事件名
	         * @param {Function} handler 事件处理函数
	         * @param {Object} [context]
	         */
	        on: function (event, handler, context) {
	            var _h = this._$handlers;
	
	            if (!handler || !event) {
	                return this;
	            }
	
	            if (!_h[event]) {
	                _h[event] = [];
	            }
	
	            for (var i = 0; i < _h[event].length; i++) {
	                if (_h[event][i].h === handler) {
	                    return this;
	                }
	            }
	
	            _h[event].push({
	                h: handler,
	                one: false,
	                ctx: context || this
	            });
	
	            return this;
	        },
	
	        /**
	         * 是否绑定了事件
	         * @param  {string}  event
	         * @return {boolean}
	         */
	        isSilent: function (event) {
	            var _h = this._$handlers;
	            return _h[event] && _h[event].length;
	        },
	
	        /**
	         * 解绑事件
	         * @param {string} event 事件名
	         * @param {Function} [handler] 事件处理函数
	         */
	        off: function (event, handler) {
	            var _h = this._$handlers;
	
	            if (!event) {
	                this._$handlers = {};
	                return this;
	            }
	
	            if (handler) {
	                if (_h[event]) {
	                    var newList = [];
	                    for (var i = 0, l = _h[event].length; i < l; i++) {
	                        if (_h[event][i]['h'] != handler) {
	                            newList.push(_h[event][i]);
	                        }
	                    }
	                    _h[event] = newList;
	                }
	
	                if (_h[event] && _h[event].length === 0) {
	                    delete _h[event];
	                }
	            }
	            else {
	                delete _h[event];
	            }
	
	            return this;
	        },
	
	        /**
	         * 事件分发
	         *
	         * @param {string} type 事件类型
	         */
	        trigger: function (type) {
	            if (this._$handlers[type]) {
	                var args = arguments;
	                var argLen = args.length;
	
	                if (argLen > 3) {
	                    args = arrySlice.call(args, 1);
	                }
	
	                var _h = this._$handlers[type];
	                var len = _h.length;
	                for (var i = 0; i < len;) {
	                    // Optimize advise from backbone
	                    switch (argLen) {
	                        case 1:
	                            _h[i]['h'].call(_h[i]['ctx']);
	                            break;
	                        case 2:
	                            _h[i]['h'].call(_h[i]['ctx'], args[1]);
	                            break;
	                        case 3:
	                            _h[i]['h'].call(_h[i]['ctx'], args[1], args[2]);
	                            break;
	                        default:
	                            // have more than 2 given arguments
	                            _h[i]['h'].apply(_h[i]['ctx'], args);
	                            break;
	                    }
	
	                    if (_h[i]['one']) {
	                        _h.splice(i, 1);
	                        len--;
	                    }
	                    else {
	                        i++;
	                    }
	                }
	            }
	
	            return this;
	        },
	
	        /**
	         * 带有context的事件分发, 最后一个参数是事件回调的context
	         * @param {string} type 事件类型
	         */
	        triggerWithContext: function (type) {
	            if (this._$handlers[type]) {
	                var args = arguments;
	                var argLen = args.length;
	
	                if (argLen > 4) {
	                    args = arrySlice.call(args, 1, args.length - 1);
	                }
	                var ctx = args[args.length - 1];
	
	                var _h = this._$handlers[type];
	                var len = _h.length;
	                for (var i = 0; i < len;) {
	                    // Optimize advise from backbone
	                    switch (argLen) {
	                        case 1:
	                            _h[i]['h'].call(ctx);
	                            break;
	                        case 2:
	                            _h[i]['h'].call(ctx, args[1]);
	                            break;
	                        case 3:
	                            _h[i]['h'].call(ctx, args[1], args[2]);
	                            break;
	                        default:
	                            // have more than 2 given arguments
	                            _h[i]['h'].apply(ctx, args);
	                            break;
	                    }
	
	                    if (_h[i]['one']) {
	                        _h.splice(i, 1);
	                        len--;
	                    }
	                    else {
	                        i++;
	                    }
	                }
	            }
	
	            return this;
	        }
	    };
	
	    // 对象可以通过 onxxxx 绑定事件
	    /**
	     * @event module:zrender/mixin/Eventful#onclick
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseover
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseout
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousemove
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousewheel
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousedown
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseup
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondrag
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragstart
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragend
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragenter
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragleave
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragover
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondrop
	     * @type {Function}
	     * @default null
	     */
	
	    module.exports = Eventful;
	


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 提供变换扩展
	 * @module zrender/mixin/Transformable
	 * @author pissang (https://www.github.com/pissang)
	 */
	
	
	    var matrix = __webpack_require__(10);
	    var vector = __webpack_require__(2);
	    var mIdentity = matrix.identity;
	
	    var EPSILON = 5e-5;
	
	    function isNotAroundZero(val) {
	        return val > EPSILON || val < -EPSILON;
	    }
	
	    /**
	     * @alias module:zrender/mixin/Transformable
	     * @constructor
	     */
	    var Transformable = function (opts) {
	        opts = opts || {};
	        // If there are no given position, rotation, scale
	        if (!opts.position) {
	            /**
	             * 平移
	             * @type {Array.<number>}
	             * @default [0, 0]
	             */
	            this.position = [0, 0];
	        }
	        if (opts.rotation == null) {
	            /**
	             * 旋转
	             * @type {Array.<number>}
	             * @default 0
	             */
	            this.rotation = 0;
	        }
	        if (!opts.scale) {
	            /**
	             * 缩放
	             * @type {Array.<number>}
	             * @default [1, 1]
	             */
	            this.scale = [1, 1];
	        }
	        /**
	         * 旋转和缩放的原点
	         * @type {Array.<number>}
	         * @default null
	         */
	        this.origin = this.origin || null;
	    };
	
	    var transformableProto = Transformable.prototype;
	    transformableProto.transform = null;
	
	    /**
	     * 判断是否需要有坐标变换
	     * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
	     */
	    transformableProto.needLocalTransform = function () {
	        return isNotAroundZero(this.rotation)
	            || isNotAroundZero(this.position[0])
	            || isNotAroundZero(this.position[1])
	            || isNotAroundZero(this.scale[0] - 1)
	            || isNotAroundZero(this.scale[1] - 1);
	    };
	
	    transformableProto.updateTransform = function () {
	        var parent = this.parent;
	        var parentHasTransform = parent && parent.transform;
	        var needLocalTransform = this.needLocalTransform();
	
	        var m = this.transform;
	        if (!(needLocalTransform || parentHasTransform)) {
	            m && mIdentity(m);
	            return;
	        }
	
	        m = m || matrix.create();
	
	        if (needLocalTransform) {
	            this.getLocalTransform(m);
	        }
	        else {
	            mIdentity(m);
	        }
	
	        // 应用父节点变换
	        if (parentHasTransform) {
	            if (needLocalTransform) {
	                matrix.mul(m, parent.transform, m);
	            }
	            else {
	                matrix.copy(m, parent.transform);
	            }
	        }
	        // 保存这个变换矩阵
	        this.transform = m;
	
	        this.invTransform = this.invTransform || matrix.create();
	        matrix.invert(this.invTransform, m);
	    };
	
	    transformableProto.getLocalTransform = function (m) {
	        m = m || [];
	        mIdentity(m);
	
	        var origin = this.origin;
	
	        var scale = this.scale;
	        var rotation = this.rotation;
	        var position = this.position;
	        if (origin) {
	            // Translate to origin
	            m[4] -= origin[0];
	            m[5] -= origin[1];
	        }
	        matrix.scale(m, m, scale);
	        if (rotation) {
	            matrix.rotate(m, m, rotation);
	        }
	        if (origin) {
	            // Translate back from origin
	            m[4] += origin[0];
	            m[5] += origin[1];
	        }
	
	        m[4] += position[0];
	        m[5] += position[1];
	
	        return m;
	    };
	    /**
	     * 将自己的transform应用到context上
	     * @param {Context2D} ctx
	     */
	    transformableProto.setTransform = function (ctx) {
	        var m = this.transform;
	        var dpr = ctx.dpr || 1;
	        if (m) {
	            ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
	        }
	        else {
	            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	        }
	    };
	
	    transformableProto.restoreTransform = function (ctx) {
	        var m = this.transform;
	        var dpr = ctx.dpr || 1;
	        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	    }
	
	    var tmpTransform = [];
	
	    /**
	     * 分解`transform`矩阵到`position`, `rotation`, `scale`
	     */
	    transformableProto.decomposeTransform = function () {
	        if (!this.transform) {
	            return;
	        }
	        var parent = this.parent;
	        var m = this.transform;
	        if (parent && parent.transform) {
	            // Get local transform and decompose them to position, scale, rotation
	            matrix.mul(tmpTransform, parent.invTransform, m);
	            m = tmpTransform;
	        }
	        var sx = m[0] * m[0] + m[1] * m[1];
	        var sy = m[2] * m[2] + m[3] * m[3];
	        var position = this.position;
	        var scale = this.scale;
	        if (isNotAroundZero(sx - 1)) {
	            sx = Math.sqrt(sx);
	        }
	        if (isNotAroundZero(sy - 1)) {
	            sy = Math.sqrt(sy);
	        }
	        if (m[0] < 0) {
	            sx = -sx;
	        }
	        if (m[3] < 0) {
	            sy = -sy;
	        }
	        position[0] = m[4];
	        position[1] = m[5];
	        scale[0] = sx;
	        scale[1] = sy;
	        this.rotation = Math.atan2(-m[1] / sy, m[0] / sx);
	    };
	
	    /**
	     * Get global scale
	     * @return {Array.<number>}
	     */
	    transformableProto.getGlobalScale = function () {
	        var m = this.transform;
	        if (!m) {
	            return [1, 1];
	        }
	        var sx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
	        var sy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
	        if (m[0] < 0) {
	            sx = -sx;
	        }
	        if (m[3] < 0) {
	            sy = -sy;
	        }
	        return [sx, sy];
	    };
	    /**
	     * 变换坐标位置到 shape 的局部坐标空间
	     * @method
	     * @param {number} x
	     * @param {number} y
	     * @return {Array.<number>}
	     */
	    transformableProto.transformCoordToLocal = function (x, y) {
	        var v2 = [x, y];
	        var invTransform = this.invTransform;
	        if (invTransform) {
	            vector.applyTransform(v2, v2, invTransform);
	        }
	        return v2;
	    };
	
	    /**
	     * 变换局部坐标位置到全局坐标空间
	     * @method
	     * @param {number} x
	     * @param {number} y
	     * @return {Array.<number>}
	     */
	    transformableProto.transformCoordToGlobal = function (x, y) {
	        var v2 = [x, y];
	        var transform = this.transform;
	        if (transform) {
	            vector.applyTransform(v2, v2, transform);
	        }
	        return v2;
	    };
	
	    module.exports = Transformable;
	


/***/ },
/* 10 */
/***/ function(module, exports) {

	
	    var ArrayCtor = typeof Float32Array === 'undefined'
	        ? Array
	        : Float32Array;
	    /**
	     * 3x2矩阵操作类
	     * @exports zrender/tool/matrix
	     */
	    var matrix = {
	        /**
	         * 创建一个单位矩阵
	         * @return {Float32Array|Array.<number>}
	         */
	        create : function() {
	            var out = new ArrayCtor(6);
	            matrix.identity(out);
	
	            return out;
	        },
	        /**
	         * 设置矩阵为单位矩阵
	         * @param {Float32Array|Array.<number>} out
	         */
	        identity : function(out) {
	            out[0] = 1;
	            out[1] = 0;
	            out[2] = 0;
	            out[3] = 1;
	            out[4] = 0;
	            out[5] = 0;
	            return out;
	        },
	        /**
	         * 复制矩阵
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} m
	         */
	        copy: function(out, m) {
	            out[0] = m[0];
	            out[1] = m[1];
	            out[2] = m[2];
	            out[3] = m[3];
	            out[4] = m[4];
	            out[5] = m[5];
	            return out;
	        },
	        /**
	         * 矩阵相乘
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} m1
	         * @param {Float32Array|Array.<number>} m2
	         */
	        mul : function (out, m1, m2) {
	            // Consider matrix.mul(m, m2, m);
	            // where out is the same as m2.
	            // So use temp variable to escape error.
	            var out0 = m1[0] * m2[0] + m1[2] * m2[1];
	            var out1 = m1[1] * m2[0] + m1[3] * m2[1];
	            var out2 = m1[0] * m2[2] + m1[2] * m2[3];
	            var out3 = m1[1] * m2[2] + m1[3] * m2[3];
	            var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	            var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	            out[0] = out0;
	            out[1] = out1;
	            out[2] = out2;
	            out[3] = out3;
	            out[4] = out4;
	            out[5] = out5;
	            return out;
	        },
	        /**
	         * 平移变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {Float32Array|Array.<number>} v
	         */
	        translate : function(out, a, v) {
	            out[0] = a[0];
	            out[1] = a[1];
	            out[2] = a[2];
	            out[3] = a[3];
	            out[4] = a[4] + v[0];
	            out[5] = a[5] + v[1];
	            return out;
	        },
	        /**
	         * 旋转变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {number} rad
	         */
	        rotate : function(out, a, rad) {
	            var aa = a[0];
	            var ac = a[2];
	            var atx = a[4];
	            var ab = a[1];
	            var ad = a[3];
	            var aty = a[5];
	            var st = Math.sin(rad);
	            var ct = Math.cos(rad);
	
	            out[0] = aa * ct + ab * st;
	            out[1] = -aa * st + ab * ct;
	            out[2] = ac * ct + ad * st;
	            out[3] = -ac * st + ct * ad;
	            out[4] = ct * atx + st * aty;
	            out[5] = ct * aty - st * atx;
	            return out;
	        },
	        /**
	         * 缩放变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {Float32Array|Array.<number>} v
	         */
	        scale : function(out, a, v) {
	            var vx = v[0];
	            var vy = v[1];
	            out[0] = a[0] * vx;
	            out[1] = a[1] * vy;
	            out[2] = a[2] * vx;
	            out[3] = a[3] * vy;
	            out[4] = a[4] * vx;
	            out[5] = a[5] * vy;
	            return out;
	        },
	        /**
	         * 求逆矩阵
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         */
	        invert : function(out, a) {
	
	            var aa = a[0];
	            var ac = a[2];
	            var atx = a[4];
	            var ab = a[1];
	            var ad = a[3];
	            var aty = a[5];
	
	            var det = aa * ad - ab * ac;
	            if (!det) {
	                return null;
	            }
	            det = 1.0 / det;
	
	            out[0] = ad * det;
	            out[1] = -ab * det;
	            out[2] = -ac * det;
	            out[3] = aa * det;
	            out[4] = (ac * aty - ad * atx) * det;
	            out[5] = (ab * atx - aa * aty) * det;
	            return out;
	        }
	    };
	
	    module.exports = matrix;
	


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @module zrender/mixin/Animatable
	 */
	
	
	    var Animator = __webpack_require__(12);
	    var util = __webpack_require__(5);
	    var isString = util.isString;
	    var isFunction = util.isFunction;
	    var isObject = util.isObject;
	    var log = __webpack_require__(16);
	
	    /**
	     * @alias modue:zrender/mixin/Animatable
	     * @constructor
	     */
	    var Animatable = function () {
	
	        /**
	         * @type {Array.<module:zrender/animation/Animator>}
	         * @readOnly
	         */
	        this.animators = [];
	    };
	
	    Animatable.prototype = {
	
	        constructor: Animatable,
	
	        /**
	         * 动画
	         *
	         * @param {string} path 需要添加动画的属性获取路径，可以通过a.b.c来获取深层的属性
	         * @param {boolean} [loop] 动画是否循环
	         * @return {module:zrender/animation/Animator}
	         * @example:
	         *     el.animate('style', false)
	         *         .when(1000, {x: 10} )
	         *         .done(function(){ // Animation done })
	         *         .start()
	         */
	        animate: function (path, loop) {	
	            var target;
	            var animatingShape = false;
	            var el = this;
	            var zr = this.__zr;
	            if (path) {
	                var pathSplitted = path.split('.');
	                var prop = el;
	                // If animating shape
	                animatingShape = pathSplitted[0] === 'shape';
	                for (var i = 0, l = pathSplitted.length; i < l; i++) {
	                    if (!prop) {
	                        continue;
	                    }
	                    prop = prop[pathSplitted[i]];
	                }
	                if (prop) {
	                    target = prop;
	                }
	            }
	            else {
	                target = el;
	            }
	
	            if (!target) {
	                log(
	                    'Property "'
	                    + path
	                    + '" is not existed in element '
	                    + el.id
	                );
	                return;
	            }
	
	            var animators = el.animators;
	
	            var animator = new Animator(target, loop);
	
	            animator.during(function (target) {
	                el.dirty(animatingShape);
	            })
	            .done(function () {
	                // FIXME Animator will not be removed if use `Animator#stop` to stop animation
	                animators.splice(util.indexOf(animators, animator), 1);
	            });
	
	            animators.push(animator);
	
	            // If animate after added to the zrender
	            if (zr) {
	                zr.animation.addAnimator(animator);
	            }			
				
	            return animator;
	        },
	
	        /**
	         * 停止动画
	         * @param {boolean} forwardToLast If move to last frame before stop
	         */
	        stopAnimation: function (forwardToLast) {
	            var animators = this.animators;
	            var len = animators.length;
	            for (var i = 0; i < len; i++) {
	                animators[i].stop(forwardToLast);
	            }
	            animators.length = 0;
	
	            return this;
	        },
	
	        /**
	         * @param {Object} target
	         * @param {number} [time=500] Time in ms
	         * @param {string} [easing='linear']
	         * @param {number} [delay=0]
	         * @param {Function} [callback]
	         *
	         * @example
	         *  // Animate position
	         *  el.animateTo({
	         *      position: [10, 10]
	         *  }, function () { // done })
	         *
	         *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
	         *  el.animateTo({
	         *      shape: {
	         *          width: 500
	         *      },
	         *      style: {
	         *          fill: 'red'
	         *      }
	         *      position: [10, 10]
	         *  }, 100, 100, 'cubicOut', function () { // done })
	         */
	         // TODO Return animation key
	        animateTo: function (target, time, delay, easing, callback) {
	            // animateTo(target, time, easing, callback);
	            if (isString(delay)) {
	                callback = easing;
	                easing = delay;
	                delay = 0;
	            }
	            // animateTo(target, time, delay, callback);
	            else if (isFunction(easing)) {
	                callback = easing;
	                easing = 'linear';
	                delay = 0;
	            }
	            // animateTo(target, time, callback);
	            else if (isFunction(delay)) {
	                callback = delay;
	                delay = 0;
	            }
	            // animateTo(target, callback)
	            else if (isFunction(time)) {
	                callback = time;
	                time = 500;
	            }
	            // animateTo(target)
	            else if (!time) {
	                time = 500;
	            }
	            // Stop all previous animations
	            this.stopAnimation();
	            this._animateToShallow('', this, target, time, delay, easing, callback);
	
	            // Animators may be removed immediately after start
	            // if there is nothing to animate
	            var animators = this.animators.slice();
	            var count = animators.length;
	            function done() {
	                count--;
	                if (!count) {
	                    callback && callback();
	                }
	            }
	
	            // No animators. This should be checked before animators[i].start(),
	            // because 'done' may be executed immediately if no need to animate.
	            if (!count) {
	                callback && callback();
	            }
	            // Start after all animators created
	            // Incase any animator is done immediately when all animation properties are not changed
	            for (var i = 0; i < animators.length; i++) {
	                animators[i]
	                    .done(done)
	                    .start(easing);
	            }
	        },
	
	        /**
	         * @private
	         * @param {string} path=''
	         * @param {Object} source=this
	         * @param {Object} target
	         * @param {number} [time=500]
	         * @param {number} [delay=0]
	         *
	         * @example
	         *  // Animate position
	         *  el._animateToShallow({
	         *      position: [10, 10]
	         *  })
	         *
	         *  // Animate shape, style and position in 100ms, delayed 100ms
	         *  el._animateToShallow({
	         *      shape: {
	         *          width: 500
	         *      },
	         *      style: {
	         *          fill: 'red'
	         *      }
	         *      position: [10, 10]
	         *  }, 100, 100)
	         */
	        _animateToShallow: function (path, source, target, time, delay) {
	            var objShallow = {};
	            var propertyCount = 0;
	            for (var name in target) {
	                if (!target.hasOwnProperty(name)) {
	                    continue;
	                }
	
	                if (source[name] != null) {
	                    if (isObject(target[name]) && !util.isArrayLike(target[name])) {
	                        this._animateToShallow(
	                            path ? path + '.' + name : name,
	                            source[name],
	                            target[name],
	                            time,
	                            delay
	                        );
	                    }
	                    else {
	                        objShallow[name] = target[name];
	                        propertyCount++;
	                    }
	                }
	                else if (target[name] != null) {
	                    // Attr directly if not has property
	                    // FIXME, if some property not needed for element ?
	                    if (!path) {
	                        this.attr(name, target[name]);
	                    }
	                    else {  // Shape or style
	                        var props = {};
	                        props[path] = {};
	                        props[path][name] = target[name];
	                        this.attr(props);
	                    }
	                }
	            }
	
	            if (propertyCount > 0) {
	                this.animate(path, false)
	                    .when(time == null ? 500 : time, objShallow)
	                    .delay(delay || 0);
	            }
	
	            return this;
	        }
	    };
	
	    module.exports = Animatable;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @module echarts/animation/Animator
	 */
	
	
	    var Clip = __webpack_require__(13);
	    var color = __webpack_require__(15);
	    var util = __webpack_require__(5);
	    var isArrayLike = util.isArrayLike;
	
	    var arraySlice = Array.prototype.slice;
	
	    function defaultGetter(target, key) {
	        return target[key];
	    }
	
	    function defaultSetter(target, key, value) {
	        target[key] = value;
	    }
	
	    /**
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} percent
	     * @return {number}
	     */
	    function interpolateNumber(p0, p1, percent) {
	        return (p1 - p0) * percent + p0;
	    }
	
	    /**
	     * @param  {string} p0
	     * @param  {string} p1
	     * @param  {number} percent
	     * @return {string}
	     */
	    function interpolateString(p0, p1, percent) {
	        return percent > 0.5 ? p1 : p0;
	    }
	
	    /**
	     * @param  {Array} p0
	     * @param  {Array} p1
	     * @param  {number} percent
	     * @param  {Array} out
	     * @param  {number} arrDim
	     */
	    function interpolateArray(p0, p1, percent, out, arrDim) {
	        var len = p0.length;
	        if (arrDim == 1) {
	            for (var i = 0; i < len; i++) {
	                out[i] = interpolateNumber(p0[i], p1[i], percent);
	            }
	        }
	        else {
	            var len2 = p0[0].length;
	            for (var i = 0; i < len; i++) {
	                for (var j = 0; j < len2; j++) {
	                    out[i][j] = interpolateNumber(
	                        p0[i][j], p1[i][j], percent
	                    );
	                }
	            }
	        }
	    }
	
	    // arr0 is source array, arr1 is target array.
	    // Do some preprocess to avoid error happened when interpolating from arr0 to arr1
	    function fillArr(arr0, arr1, arrDim) {
	        var arr0Len = arr0.length;
	        var arr1Len = arr1.length;
	        if (arr0Len !== arr1Len) {
	            // FIXME Not work for TypedArray
	            var isPreviousLarger = arr0Len > arr1Len;
	            if (isPreviousLarger) {
	                // Cut the previous
	                arr0.length = arr1Len;
	            }
	            else {
	                // Fill the previous
	                for (var i = arr0Len; i < arr1Len; i++) {
	                    arr0.push(
	                        arrDim === 1 ? arr1[i] : arraySlice.call(arr1[i])
	                    );
	                }
	            }
	        }
	        // Handling NaN value
	        var len2 = arr0[0] && arr0[0].length;
	        for (var i = 0; i < arr0.length; i++) {
	            if (arrDim === 1) {
	                if (isNaN(arr0[i])) {
	                    arr0[i] = arr1[i];
	                }
	            }
	            else {
	                for (var j = 0; j < len2; j++) {
	                    if (isNaN(arr0[i][j])) {
	                        arr0[i][j] = arr1[i][j];
	                    }
	                }
	            }
	        }
	    }
	
	    /**
	     * @param  {Array} arr0
	     * @param  {Array} arr1
	     * @param  {number} arrDim
	     * @return {boolean}
	     */
	    function isArraySame(arr0, arr1, arrDim) {
	        if (arr0 === arr1) {
	            return true;
	        }
	        var len = arr0.length;
	        if (len !== arr1.length) {
	            return false;
	        }
	        if (arrDim === 1) {
	            for (var i = 0; i < len; i++) {
	                if (arr0[i] !== arr1[i]) {
	                    return false;
	                }
	            }
	        }
	        else {
	            var len2 = arr0[0].length;
	            for (var i = 0; i < len; i++) {
	                for (var j = 0; j < len2; j++) {
	                    if (arr0[i][j] !== arr1[i][j]) {
	                        return false;
	                    }
	                }
	            }
	        }
	        return true;
	    }
	
	    /**
	     * Catmull Rom interpolate array
	     * @param  {Array} p0
	     * @param  {Array} p1
	     * @param  {Array} p2
	     * @param  {Array} p3
	     * @param  {number} t
	     * @param  {number} t2
	     * @param  {number} t3
	     * @param  {Array} out
	     * @param  {number} arrDim
	     */
	    function catmullRomInterpolateArray(
	        p0, p1, p2, p3, t, t2, t3, out, arrDim
	    ) {
	        var len = p0.length;
	        if (arrDim == 1) {
	            for (var i = 0; i < len; i++) {
	                out[i] = catmullRomInterpolate(
	                    p0[i], p1[i], p2[i], p3[i], t, t2, t3
	                );
	            }
	        }
	        else {
	            var len2 = p0[0].length;
	            for (var i = 0; i < len; i++) {
	                for (var j = 0; j < len2; j++) {
	                    out[i][j] = catmullRomInterpolate(
	                        p0[i][j], p1[i][j], p2[i][j], p3[i][j],
	                        t, t2, t3
	                    );
	                }
	            }
	        }
	    }
	
	    /**
	     * Catmull Rom interpolate number
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @param  {number} t2
	     * @param  {number} t3
	     * @return {number}
	     */
	    function catmullRomInterpolate(p0, p1, p2, p3, t, t2, t3) {
	        var v0 = (p2 - p0) * 0.5;
	        var v1 = (p3 - p1) * 0.5;
	        return (2 * (p1 - p2) + v0 + v1) * t3
	                + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
	                + v0 * t + p1;
	    }
	
	    function cloneValue(value) {
	        if (isArrayLike(value)) {
	            var len = value.length;
	            if (isArrayLike(value[0])) {
	                var ret = [];
	                for (var i = 0; i < len; i++) {
	                    ret.push(arraySlice.call(value[i]));
	                }
	                return ret;
	            }
	
	            return arraySlice.call(value);
	        }
	
	        return value;
	    }
	
	    function rgba2String(rgba) {
	        rgba[0] = Math.floor(rgba[0]);
	        rgba[1] = Math.floor(rgba[1]);
	        rgba[2] = Math.floor(rgba[2]);
	
	        return 'rgba(' + rgba.join(',') + ')';
	    }
	
	    function createTrackClip (animator, easing, oneTrackDone, keyframes, propName) {
	        var getter = animator._getter;
	        var setter = animator._setter;
	        var useSpline = easing === 'spline';
	
	        var trackLen = keyframes.length;
	        if (!trackLen) {
	            return;
	        }
	        // Guess data type
	        var firstVal = keyframes[0].value;
	        var isValueArray = isArrayLike(firstVal);
	        var isValueColor = false;
	        var isValueString = false;
	
	        // For vertices morphing
	        var arrDim = (
	                isValueArray
	                && isArrayLike(firstVal[0])
	            )
	            ? 2 : 1;
	        var trackMaxTime;
	        // Sort keyframe as ascending
	        keyframes.sort(function(a, b) {
	            return a.time - b.time;
	        });
	
	        trackMaxTime = keyframes[trackLen - 1].time;
	        // Percents of each keyframe
	        var kfPercents = [];
	        // Value of each keyframe
	        var kfValues = [];
	        var prevValue = keyframes[0].value;
	        var isAllValueEqual = true;
	        for (var i = 0; i < trackLen; i++) {
	            kfPercents.push(keyframes[i].time / trackMaxTime);
	            // Assume value is a color when it is a string
	            var value = keyframes[i].value;
	
	            // Check if value is equal, deep check if value is array
	            if (!((isValueArray && isArraySame(value, prevValue, arrDim))
	                || (!isValueArray && value === prevValue))) {
	                isAllValueEqual = false;
	            }
	            prevValue = value;
	
	            // Try converting a string to a color array
	            if (typeof value == 'string') {
	                var colorArray = color.parse(value);
	                if (colorArray) {
	                    value = colorArray;
	                    isValueColor = true;
	                }
	                else {
	                    isValueString = true;
	                }
	            }
	            kfValues.push(value);
	        }
	        if (isAllValueEqual) {
	            return;
	        }
	
	        var lastValue = kfValues[trackLen - 1];
	        // Polyfill array and NaN value
	        for (var i = 0; i < trackLen - 1; i++) {
	            if (isValueArray) {
	                fillArr(kfValues[i], lastValue, arrDim);
	            }
	            else {
	                if (isNaN(kfValues[i]) && !isNaN(lastValue) && !isValueString && !isValueColor) {
	                    kfValues[i] = lastValue;
	                }
	            }
	        }
	        isValueArray && fillArr(getter(animator._target, propName), lastValue, arrDim);
	
	        // Cache the key of last frame to speed up when
	        // animation playback is sequency
	        var lastFrame = 0;
	        var lastFramePercent = 0;
	        var start;
	        var w;
	        var p0;
	        var p1;
	        var p2;
	        var p3;
	
	        if (isValueColor) {
	            var rgba = [0, 0, 0, 0];
	        }
	
	        var onframe = function (target, percent) {
	            // Find the range keyframes
	            // kf1-----kf2---------current--------kf3
	            // find kf2 and kf3 and do interpolation
	            var frame;
	            // In the easing function like elasticOut, percent may less than 0
	            if (percent < 0) {
	                frame = 0;
	            }
	            else if (percent < lastFramePercent) {
	                // Start from next key
	                // PENDING start from lastFrame ?
	                start = Math.min(lastFrame + 1, trackLen - 1);
	                for (frame = start; frame >= 0; frame--) {
	                    if (kfPercents[frame] <= percent) {
	                        break;
	                    }
	                }
	                // PENDING really need to do this ?
	                frame = Math.min(frame, trackLen - 2);
	            }
	            else {
	                for (frame = lastFrame; frame < trackLen; frame++) {
	                    if (kfPercents[frame] > percent) {
	                        break;
	                    }
	                }
	                frame = Math.min(frame - 1, trackLen - 2);
	            }
	            lastFrame = frame;
	            lastFramePercent = percent;
	
	            var range = (kfPercents[frame + 1] - kfPercents[frame]);
	            if (range === 0) {
	                return;
	            }
	            else {
	                w = (percent - kfPercents[frame]) / range;
	            }
	            if (useSpline) {
	                p1 = kfValues[frame];
	                p0 = kfValues[frame === 0 ? frame : frame - 1];
	                p2 = kfValues[frame > trackLen - 2 ? trackLen - 1 : frame + 1];
	                p3 = kfValues[frame > trackLen - 3 ? trackLen - 1 : frame + 2];
	                if (isValueArray) {
	                    catmullRomInterpolateArray(
	                        p0, p1, p2, p3, w, w * w, w * w * w,
	                        getter(target, propName),
	                        arrDim
	                    );
	                }
	                else {
	                    var value;
	                    if (isValueColor) {
	                        value = catmullRomInterpolateArray(
	                            p0, p1, p2, p3, w, w * w, w * w * w,
	                            rgba, 1
	                        );
	                        value = rgba2String(rgba);
	                    }
	                    else if (isValueString) {
	                        // String is step(0.5)
	                        return interpolateString(p1, p2, w);
	                    }
	                    else {
	                        value = catmullRomInterpolate(
	                            p0, p1, p2, p3, w, w * w, w * w * w
	                        );
	                    }
	                    setter(
	                        target,
	                        propName,
	                        value
	                    );
	                }
	            }
	            else {
	                if (isValueArray) {
	                    interpolateArray(
	                        kfValues[frame], kfValues[frame + 1], w,
	                        getter(target, propName),
	                        arrDim
	                    );
	                }
	                else {
	                    var value;
	                    if (isValueColor) {
	                        interpolateArray(
	                            kfValues[frame], kfValues[frame + 1], w,
	                            rgba, 1
	                        );
	                        value = rgba2String(rgba);
	                    }
	                    else if (isValueString) {
	                        // String is step(0.5)
	                        return interpolateString(kfValues[frame], kfValues[frame + 1], w);
	                    }
	                    else {
	                        value = interpolateNumber(kfValues[frame], kfValues[frame + 1], w);
	                    }
	                    setter(
	                        target,
	                        propName,
	                        value
	                    );
	                }
	            }
	        };
	
	        var clip = new Clip({
	            target: animator._target,
	            life: trackMaxTime,
	            loop: animator._loop,
	            delay: animator._delay,
	            onframe: onframe,
	            ondestroy: oneTrackDone
	        });
	
	        if (easing && easing !== 'spline') {
	            clip.easing = easing;
	        }
	
	        return clip;
	    }
	
	    /**
	     * @alias module:zrender/animation/Animator
	     * @constructor
	     * @param {Object} target
	     * @param {boolean} loop
	     * @param {Function} getter
	     * @param {Function} setter
	     */
	    var Animator = function(target, loop, getter, setter) {
	        this._tracks = {};
	        this._target = target;
	
	        this._loop = loop || false;
	
	        this._getter = getter || defaultGetter;
	        this._setter = setter || defaultSetter;
	
	        this._clipCount = 0;
	
	        this._delay = 0;
	
	        this._doneList = [];
	
	        this._onframeList = [];
	
	        this._clipList = [];
	    };
	
	    Animator.prototype = {
	        /**
	         * 设置动画关键帧
	         * @param  {number} time 关键帧时间，单位是ms
	         * @param  {Object} props 关键帧的属性值，key-value表示
	         * @return {module:zrender/animation/Animator}
	         */
	        when: function(time /* ms */, props) {
	            var tracks = this._tracks;
	            for (var propName in props) {
	                if (!props.hasOwnProperty(propName)) {
	                    continue;
	                }
	
	                if (!tracks[propName]) {
	                    tracks[propName] = [];
	                    // Invalid value
	                    var value = this._getter(this._target, propName);
	                    if (value == null) {
	                        // zrLog('Invalid property ' + propName);
	                        continue;
	                    }
	                    // If time is 0
	                    //  Then props is given initialize value
	                    // Else
	                    //  Initialize value from current prop value
	                    if (time !== 0) {
	                        tracks[propName].push({
	                            time: 0,
	                            value: cloneValue(value)
	                        });
	                    }
	                }
	                tracks[propName].push({
	                    time: time,
	                    value: props[propName]
	                });
	            }
				
				
	            return this;
	        },
	        /**
	         * 添加动画每一帧的回调函数
	         * @param  {Function} callback
	         * @return {module:zrender/animation/Animator}
	         */
	        during: function (callback) {
	            this._onframeList.push(callback);
	            return this;
	        },
	
	        _doneCallback: function () {
	            // Clear all tracks
	            this._tracks = {};
	            // Clear all clips
	            this._clipList.length = 0;
	
	            var doneList = this._doneList;			
	
	            var len = doneList.length;
	            for (var i = 0; i < len; i++) {
	                doneList[i].call(this);
	            }
	        },
	        /**
	         * 开始执行动画
	         * @param  {string|Function} easing
	         *         动画缓动函数，详见{@link module:zrender/animation/easing}
	         * @return {module:zrender/animation/Animator}
	         */
	        start: function (easing) {
	
	            var self = this;
	            var clipCount = 0;
	
	            var oneTrackDone = function() {
	                clipCount--;
	                if (!clipCount) {
	                    self._doneCallback();
	                }
	            };			
				
	
	            var lastClip;
	            for (var propName in this._tracks) {
	                if (!this._tracks.hasOwnProperty(propName)) {
	                    continue;
	                }
	                var clip = createTrackClip(
	                    this, easing, oneTrackDone,
	                    this._tracks[propName], propName
	                );
	                if (clip) {
	                    this._clipList.push(clip);
	                    clipCount++;
	
	                    // If start after added to animation
	                    if (this.animation) {
	                        this.animation.addClip(clip);
	                    }
	
	                    lastClip = clip;
	                }
	            }
	
	            // Add during callback on the last clip
	            if (lastClip) {
	                var oldOnFrame = lastClip.onframe;
	                lastClip.onframe = function (target, percent) {
	                    oldOnFrame(target, percent);
	
	                    for (var i = 0; i < self._onframeList.length; i++) {
	                        self._onframeList[i](target, percent);
	                    }
	                };
	            }
	
	            if (!clipCount) {
	                this._doneCallback();
	            }
				
			
	            return this;
	        },
	        /**
	         * 停止动画
	         * @param {boolean} forwardToLast If move to last frame before stop
	         */
	        stop: function (forwardToLast) {
	            var clipList = this._clipList;
	            var animation = this.animation;
	            for (var i = 0; i < clipList.length; i++) {
	                var clip = clipList[i];
	                if (forwardToLast) {
	                    // Move to last frame before stop
	                    clip.onframe(this._target, 1);
	                }
	                animation && animation.removeClip(clip);
	            }
	            clipList.length = 0;
	        },
	        /**
	         * 设置动画延迟开始的时间
	         * @param  {number} time 单位ms
	         * @return {module:zrender/animation/Animator}
	         */
	        delay: function (time) {
	            this._delay = time;
	            return this;
	        },
	        /**
	         * 添加动画结束的回调
	         * @param  {Function} cb
	         * @return {module:zrender/animation/Animator}
	         */
	        done: function(cb) {
	            if (cb) {
	                this._doneList.push(cb);
	            }
	            return this;
	        },
	
	        /**
	         * @return {Array.<module:zrender/animation/Clip>}
	         */
	        getClips: function () {
	            return this._clipList;
	        }
	    };
	
	    module.exports = Animator;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 动画主控制器
	 * @config target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
	 * @config life(1000) 动画时长
	 * @config delay(0) 动画延迟时间
	 * @config loop(true)
	 * @config gap(0) 循环的间隔时间
	 * @config onframe
	 * @config easing(optional)
	 * @config ondestroy(optional)
	 * @config onrestart(optional)
	 *
	 * TODO pause
	 */
	
	
	    var easingFuncs = __webpack_require__(14);
	
	    function Clip(options) {
	
	        this._target = options.target;
	
	        // 生命周期
	        this._life = options.life || 1000;
	        // 延时
	        this._delay = options.delay || 0;
	        // 开始时间
	        // this._startTime = new Date().getTime() + this._delay;// 单位毫秒
	        this._initialized = false;
	
	        // 是否循环
	        this.loop = options.loop == null ? false : options.loop;
	
	        this.gap = options.gap || 0;
	
	        this.easing = options.easing || 'Linear';
	
	        this.onframe = options.onframe;
	        this.ondestroy = options.ondestroy;
	        this.onrestart = options.onrestart;
	    }
	
	    Clip.prototype = {
	
	        constructor: Clip,
	
	        step: function (globalTime) {
	            // Set startTime on first step, or _startTime may has milleseconds different between clips
	            // PENDING
	            if (!this._initialized) {
	                this._startTime = globalTime + this._delay;
	                this._initialized = true;
	            }
	
	            var percent = (globalTime - this._startTime) / this._life;
	
	            // 还没开始
	            if (percent < 0) {
	                return;
	            }
	
	            percent = Math.min(percent, 1);
	
	            var easing = this.easing;
	            var easingFunc = typeof easing == 'string' ? easingFuncs[easing] : easing;
				
	            var schedule = typeof easingFunc === 'function'
	                ? easingFunc(percent)
	                : percent;
	
	            this.fire('frame', schedule);
	
				
	            // 结束
	            if (percent == 1) {
	                if (this.loop) {
	                    this.restart (globalTime);
	                    // 重新开始周期
	                    // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件
	                    return 'restart';
	                }
	
	                // 动画完成将这个控制器标识为待删除
	                // 在Animation.update中进行批量删除
	                this._needsRemove = true;
	                return 'destroy';
	            }
				
	
	            return null;
	        },
	
	        restart: function (globalTime) {
	            var remainder = (globalTime - this._startTime) % this._life;
	            this._startTime = globalTime - remainder + this.gap;
	
	            this._needsRemove = false;
	        },
	
	        fire: function(eventType, arg) {
				
	            eventType = 'on' + eventType;
	            if (this[eventType]) {	
	                this[eventType](this._target, arg);
	            }
				
	        }
	    };
	
	    module.exports = Clip;
	


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * 缓动代码来自 https://github.com/sole/tween.js/blob/master/src/Tween.js
	 * @see http://sole.github.io/tween.js/examples/03_graphs.html
	 * @exports zrender/animation/easing
	 */
	
	    var easing = {
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        linear: function (k) {
	            return k;
	        },
	
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quadraticIn: function (k) {
	            return k * k;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quadraticOut: function (k) {
	            return k * (2 - k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quadraticInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return 0.5 * k * k;
	            }
	            return -0.5 * (--k * (k - 2) - 1);
	        },
	
	        // 三次方的缓动（t^3）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        cubicIn: function (k) {
	            return k * k * k;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        cubicOut: function (k) {
	            return --k * k * k + 1;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        cubicInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return 0.5 * k * k * k;
	            }
	            return 0.5 * ((k -= 2) * k * k + 2);
	        },
	
	        // 四次方的缓动（t^4）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quarticIn: function (k) {
	            return k * k * k * k;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quarticOut: function (k) {
	            return 1 - (--k * k * k * k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quarticInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return 0.5 * k * k * k * k;
	            }
	            return -0.5 * ((k -= 2) * k * k * k - 2);
	        },
	
	        // 五次方的缓动（t^5）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quinticIn: function (k) {
	            return k * k * k * k * k;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quinticOut: function (k) {
	            return --k * k * k * k * k + 1;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quinticInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return 0.5 * k * k * k * k * k;
	            }
	            return 0.5 * ((k -= 2) * k * k * k * k + 2);
	        },
	
	        // 正弦曲线的缓动（sin(t)）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        sinusoidalIn: function (k) {
	            return 1 - Math.cos(k * Math.PI / 2);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        sinusoidalOut: function (k) {
	            return Math.sin(k * Math.PI / 2);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        sinusoidalInOut: function (k) {
	            return 0.5 * (1 - Math.cos(Math.PI * k));
	        },
	
	        // 指数曲线的缓动（2^t）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        exponentialIn: function (k) {
	            return k === 0 ? 0 : Math.pow(1024, k - 1);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        exponentialOut: function (k) {
	            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        exponentialInOut: function (k) {
	            if (k === 0) {
	                return 0;
	            }
	            if (k === 1) {
	                return 1;
	            }
	            if ((k *= 2) < 1) {
	                return 0.5 * Math.pow(1024, k - 1);
	            }
	            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
	        },
	
	        // 圆形曲线的缓动（sqrt(1-t^2)）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        circularIn: function (k) {
	            return 1 - Math.sqrt(1 - k * k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        circularOut: function (k) {
	            return Math.sqrt(1 - (--k * k));
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        circularInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return -0.5 * (Math.sqrt(1 - k * k) - 1);
	            }
	            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
	        },
	
	        // 创建类似于弹簧在停止前来回振荡的动画
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        elasticIn: function (k) {
	            var s;
	            var a = 0.1;
	            var p = 0.4;
	            if (k === 0) {
	                return 0;
	            }
	            if (k === 1) {
	                return 1;
	            }
	            if (!a || a < 1) {
	                a = 1; s = p / 4;
	            }
	            else {
	                s = p * Math.asin(1 / a) / (2 * Math.PI);
	            }
	            return -(a * Math.pow(2, 10 * (k -= 1)) *
	                        Math.sin((k - s) * (2 * Math.PI) / p));
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        elasticOut: function (k) {
	            var s;
	            var a = 0.1;
	            var p = 0.4;
	            if (k === 0) {
	                return 0;
	            }
	            if (k === 1) {
	                return 1;
	            }
	            if (!a || a < 1) {
	                a = 1; s = p / 4;
	            }
	            else {
	                s = p * Math.asin(1 / a) / (2 * Math.PI);
	            }
	            return (a * Math.pow(2, -10 * k) *
	                    Math.sin((k - s) * (2 * Math.PI) / p) + 1);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        elasticInOut: function (k) {
	            var s;
	            var a = 0.1;
	            var p = 0.4;
	            if (k === 0) {
	                return 0;
	            }
	            if (k === 1) {
	                return 1;
	            }
	            if (!a || a < 1) {
	                a = 1; s = p / 4;
	            }
	            else {
	                s = p * Math.asin(1 / a) / (2 * Math.PI);
	            }
	            if ((k *= 2) < 1) {
	                return -0.5 * (a * Math.pow(2, 10 * (k -= 1))
	                    * Math.sin((k - s) * (2 * Math.PI) / p));
	            }
	            return a * Math.pow(2, -10 * (k -= 1))
	                    * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
	
	        },
	
	        // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        backIn: function (k) {
	            var s = 1.70158;
	            return k * k * ((s + 1) * k - s);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        backOut: function (k) {
	            var s = 1.70158;
	            return --k * k * ((s + 1) * k + s) + 1;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        backInOut: function (k) {
	            var s = 1.70158 * 1.525;
	            if ((k *= 2) < 1) {
	                return 0.5 * (k * k * ((s + 1) * k - s));
	            }
	            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
	        },
	
	        // 创建弹跳效果
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        bounceIn: function (k) {
	            return 1 - easing.bounceOut(1 - k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        bounceOut: function (k) {
	            if (k < (1 / 2.75)) {
	                return 7.5625 * k * k;
	            }
	            else if (k < (2 / 2.75)) {
	                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
	            }
	            else if (k < (2.5 / 2.75)) {
	                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
	            }
	            else {
	                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
	            }
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        bounceInOut: function (k) {
	            if (k < 0.5) {
	                return easing.bounceIn(k * 2) * 0.5;
	            }
	            return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
	        }
	    };
	
	    module.exports = easing;
	
	


/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * @module zrender/tool/color
	 */
	
	
	    var kCSSColorTable = {
	        'transparent': [0,0,0,0], 'aliceblue': [240,248,255,1],
	        'antiquewhite': [250,235,215,1], 'aqua': [0,255,255,1],
	        'aquamarine': [127,255,212,1], 'azure': [240,255,255,1],
	        'beige': [245,245,220,1], 'bisque': [255,228,196,1],
	        'black': [0,0,0,1], 'blanchedalmond': [255,235,205,1],
	        'blue': [0,0,255,1], 'blueviolet': [138,43,226,1],
	        'brown': [165,42,42,1], 'burlywood': [222,184,135,1],
	        'cadetblue': [95,158,160,1], 'chartreuse': [127,255,0,1],
	        'chocolate': [210,105,30,1], 'coral': [255,127,80,1],
	        'cornflowerblue': [100,149,237,1], 'cornsilk': [255,248,220,1],
	        'crimson': [220,20,60,1], 'cyan': [0,255,255,1],
	        'darkblue': [0,0,139,1], 'darkcyan': [0,139,139,1],
	        'darkgoldenrod': [184,134,11,1], 'darkgray': [169,169,169,1],
	        'darkgreen': [0,100,0,1], 'darkgrey': [169,169,169,1],
	        'darkkhaki': [189,183,107,1], 'darkmagenta': [139,0,139,1],
	        'darkolivegreen': [85,107,47,1], 'darkorange': [255,140,0,1],
	        'darkorchid': [153,50,204,1], 'darkred': [139,0,0,1],
	        'darksalmon': [233,150,122,1], 'darkseagreen': [143,188,143,1],
	        'darkslateblue': [72,61,139,1], 'darkslategray': [47,79,79,1],
	        'darkslategrey': [47,79,79,1], 'darkturquoise': [0,206,209,1],
	        'darkviolet': [148,0,211,1], 'deeppink': [255,20,147,1],
	        'deepskyblue': [0,191,255,1], 'dimgray': [105,105,105,1],
	        'dimgrey': [105,105,105,1], 'dodgerblue': [30,144,255,1],
	        'firebrick': [178,34,34,1], 'floralwhite': [255,250,240,1],
	        'forestgreen': [34,139,34,1], 'fuchsia': [255,0,255,1],
	        'gainsboro': [220,220,220,1], 'ghostwhite': [248,248,255,1],
	        'gold': [255,215,0,1], 'goldenrod': [218,165,32,1],
	        'gray': [128,128,128,1], 'green': [0,128,0,1],
	        'greenyellow': [173,255,47,1], 'grey': [128,128,128,1],
	        'honeydew': [240,255,240,1], 'hotpink': [255,105,180,1],
	        'indianred': [205,92,92,1], 'indigo': [75,0,130,1],
	        'ivory': [255,255,240,1], 'khaki': [240,230,140,1],
	        'lavender': [230,230,250,1], 'lavenderblush': [255,240,245,1],
	        'lawngreen': [124,252,0,1], 'lemonchiffon': [255,250,205,1],
	        'lightblue': [173,216,230,1], 'lightcoral': [240,128,128,1],
	        'lightcyan': [224,255,255,1], 'lightgoldenrodyellow': [250,250,210,1],
	        'lightgray': [211,211,211,1], 'lightgreen': [144,238,144,1],
	        'lightgrey': [211,211,211,1], 'lightpink': [255,182,193,1],
	        'lightsalmon': [255,160,122,1], 'lightseagreen': [32,178,170,1],
	        'lightskyblue': [135,206,250,1], 'lightslategray': [119,136,153,1],
	        'lightslategrey': [119,136,153,1], 'lightsteelblue': [176,196,222,1],
	        'lightyellow': [255,255,224,1], 'lime': [0,255,0,1],
	        'limegreen': [50,205,50,1], 'linen': [250,240,230,1],
	        'magenta': [255,0,255,1], 'maroon': [128,0,0,1],
	        'mediumaquamarine': [102,205,170,1], 'mediumblue': [0,0,205,1],
	        'mediumorchid': [186,85,211,1], 'mediumpurple': [147,112,219,1],
	        'mediumseagreen': [60,179,113,1], 'mediumslateblue': [123,104,238,1],
	        'mediumspringgreen': [0,250,154,1], 'mediumturquoise': [72,209,204,1],
	        'mediumvioletred': [199,21,133,1], 'midnightblue': [25,25,112,1],
	        'mintcream': [245,255,250,1], 'mistyrose': [255,228,225,1],
	        'moccasin': [255,228,181,1], 'navajowhite': [255,222,173,1],
	        'navy': [0,0,128,1], 'oldlace': [253,245,230,1],
	        'olive': [128,128,0,1], 'olivedrab': [107,142,35,1],
	        'orange': [255,165,0,1], 'orangered': [255,69,0,1],
	        'orchid': [218,112,214,1], 'palegoldenrod': [238,232,170,1],
	        'palegreen': [152,251,152,1], 'paleturquoise': [175,238,238,1],
	        'palevioletred': [219,112,147,1], 'papayawhip': [255,239,213,1],
	        'peachpuff': [255,218,185,1], 'peru': [205,133,63,1],
	        'pink': [255,192,203,1], 'plum': [221,160,221,1],
	        'powderblue': [176,224,230,1], 'purple': [128,0,128,1],
	        'red': [255,0,0,1], 'rosybrown': [188,143,143,1],
	        'royalblue': [65,105,225,1], 'saddlebrown': [139,69,19,1],
	        'salmon': [250,128,114,1], 'sandybrown': [244,164,96,1],
	        'seagreen': [46,139,87,1], 'seashell': [255,245,238,1],
	        'sienna': [160,82,45,1], 'silver': [192,192,192,1],
	        'skyblue': [135,206,235,1], 'slateblue': [106,90,205,1],
	        'slategray': [112,128,144,1], 'slategrey': [112,128,144,1],
	        'snow': [255,250,250,1], 'springgreen': [0,255,127,1],
	        'steelblue': [70,130,180,1], 'tan': [210,180,140,1],
	        'teal': [0,128,128,1], 'thistle': [216,191,216,1],
	        'tomato': [255,99,71,1], 'turquoise': [64,224,208,1],
	        'violet': [238,130,238,1], 'wheat': [245,222,179,1],
	        'white': [255,255,255,1], 'whitesmoke': [245,245,245,1],
	        'yellow': [255,255,0,1], 'yellowgreen': [154,205,50,1]
	    };
	
	    function clampCssByte(i) {  // Clamp to integer 0 .. 255.
	        i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
	        return i < 0 ? 0 : i > 255 ? 255 : i;
	    }
	
	    function clampCssAngle(i) {  // Clamp to integer 0 .. 360.
	        i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
	        return i < 0 ? 0 : i > 360 ? 360 : i;
	    }
	
	    function clampCssFloat(f) {  // Clamp to float 0.0 .. 1.0.
	        return f < 0 ? 0 : f > 1 ? 1 : f;
	    }
	
	    function parseCssInt(str) {  // int or percentage.
	        if (str.length && str.charAt(str.length - 1) === '%') {
	            return clampCssByte(parseFloat(str) / 100 * 255);
	        }
	        return clampCssByte(parseInt(str, 10));
	    }
	
	    function parseCssFloat(str) {  // float or percentage.
	        if (str.length && str.charAt(str.length - 1) === '%') {
	            return clampCssFloat(parseFloat(str) / 100);
	        }
	        return clampCssFloat(parseFloat(str));
	    }
	
	    function cssHueToRgb(m1, m2, h) {
	        if (h < 0) {
	            h += 1;
	        }
	        else if (h > 1) {
	            h -= 1;
	        }
	
	        if (h * 6 < 1) {
	            return m1 + (m2 - m1) * h * 6;
	        }
	        if (h * 2 < 1) {
	            return m2;
	        }
	        if (h * 3 < 2) {
	            return m1 + (m2 - m1) * (2/3 - h) * 6;
	        }
	        return m1;
	    }
	
	    function lerp(a, b, p) {
	        return a + (b - a) * p;
	    }
	
	    /**
	     * @param {string} colorStr
	     * @return {Array.<number>}
	     * @memberOf module:zrender/util/color
	     */
	    function parse(colorStr) {
	        if (!colorStr) {
	            return;
	        }
	        // colorStr may be not string
	        colorStr = colorStr + '';
	        // Remove all whitespace, not compliant, but should just be more accepting.
	        var str = colorStr.replace(/ /g, '').toLowerCase();
	
	        // Color keywords (and transparent) lookup.
	        if (str in kCSSColorTable) {
	            return kCSSColorTable[str].slice();  // dup.
	        }
	
	        // #abc and #abc123 syntax.
	        if (str.charAt(0) === '#') {
	            if (str.length === 4) {
	                var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
	                if (!(iv >= 0 && iv <= 0xfff)) {
	                    return;  // Covers NaN.
	                }
	                return [
	                    ((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8),
	                    (iv & 0xf0) | ((iv & 0xf0) >> 4),
	                    (iv & 0xf) | ((iv & 0xf) << 4),
	                    1
	                ];
	            }
	            else if (str.length === 7) {
	                var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
	                if (!(iv >= 0 && iv <= 0xffffff)) {
	                    return;  // Covers NaN.
	                }
	                return [
	                    (iv & 0xff0000) >> 16,
	                    (iv & 0xff00) >> 8,
	                    iv & 0xff,
	                    1
	                ];
	            }
	
	            return;
	        }
	        var op = str.indexOf('('), ep = str.indexOf(')');
	        if (op !== -1 && ep + 1 === str.length) {
	            var fname = str.substr(0, op);
	            var params = str.substr(op + 1, ep - (op + 1)).split(',');
	            var alpha = 1;  // To allow case fallthrough.
	            switch (fname) {
	                case 'rgba':
	                    if (params.length !== 4) {
	                        return;
	                    }
	                    alpha = parseCssFloat(params.pop()); // jshint ignore:line
	                // Fall through.
	                case 'rgb':
	                    if (params.length !== 3) {
	                        return;
	                    }
	                    return [
	                        parseCssInt(params[0]),
	                        parseCssInt(params[1]),
	                        parseCssInt(params[2]),
	                        alpha
	                    ];
	                case 'hsla':
	                    if (params.length !== 4) {
	                        return;
	                    }
	                    params[3] = parseCssFloat(params[3]);
	                    return hsla2rgba(params);
	                case 'hsl':
	                    if (params.length !== 3) {
	                        return;
	                    }
	                    return hsla2rgba(params);
	                default:
	                    return;
	            }
	        }
	
	        return;
	    }
	
	    /**
	     * @param {Array.<number>} hsla
	     * @return {Array.<number>} rgba
	     */
	    function hsla2rgba(hsla) {
	        var h = (((parseFloat(hsla[0]) % 360) + 360) % 360) / 360;  // 0 .. 1
	        // NOTE(deanm): According to the CSS spec s/l should only be
	        // percentages, but we don't bother and let float or percentage.
	        var s = parseCssFloat(hsla[1]);
	        var l = parseCssFloat(hsla[2]);
	        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
	        var m1 = l * 2 - m2;
	
	        var rgba = [
	            clampCssByte(cssHueToRgb(m1, m2, h + 1 / 3) * 255),
	            clampCssByte(cssHueToRgb(m1, m2, h) * 255),
	            clampCssByte(cssHueToRgb(m1, m2, h - 1 / 3) * 255)
	        ];
	
	        if (hsla.length === 4) {
	            rgba[3] = hsla[3];
	        }
	
	        return rgba;
	    }
	
	    /**
	     * @param {Array.<number>} rgba
	     * @return {Array.<number>} hsla
	     */
	    function rgba2hsla(rgba) {
	        if (!rgba) {
	            return;
	        }
	
	        // RGB from 0 to 255
	        var R = rgba[0] / 255;
	        var G = rgba[1] / 255;
	        var B = rgba[2] / 255;
	
	        var vMin = Math.min(R, G, B); // Min. value of RGB
	        var vMax = Math.max(R, G, B); // Max. value of RGB
	        var delta = vMax - vMin; // Delta RGB value
	
	        var L = (vMax + vMin) / 2;
	        var H;
	        var S;
	        // HSL results from 0 to 1
	        if (delta === 0) {
	            H = 0;
	            S = 0;
	        }
	        else {
	            if (L < 0.5) {
	                S = delta / (vMax + vMin);
	            }
	            else {
	                S = delta / (2 - vMax - vMin);
	            }
	
	            var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
	            var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
	            var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;
	
	            if (R === vMax) {
	                H = deltaB - deltaG;
	            }
	            else if (G === vMax) {
	                H = (1 / 3) + deltaR - deltaB;
	            }
	            else if (B === vMax) {
	                H = (2 / 3) + deltaG - deltaR;
	            }
	
	            if (H < 0) {
	                H += 1;
	            }
	
	            if (H > 1) {
	                H -= 1;
	            }
	        }
	
	        var hsla = [H * 360, S, L];
	
	        if (rgba[3] != null) {
	            hsla.push(rgba[3]);
	        }
	
	        return hsla;
	    }
	
	    /**
	     * @param {string} color
	     * @param {number} level
	     * @return {string}
	     * @memberOf module:zrender/util/color
	     */
	    function lift(color, level) {
	        var colorArr = parse(color);
	        if (colorArr) {
	            for (var i = 0; i < 3; i++) {
	                if (level < 0) {
	                    colorArr[i] = colorArr[i] * (1 - level) | 0;
	                }
	                else {
	                    colorArr[i] = ((255 - colorArr[i]) * level + colorArr[i]) | 0;
	                }
	            }
	            return stringify(colorArr, colorArr.length === 4 ? 'rgba' : 'rgb');
	        }
	    }
	
	    /**
	     * @param {string} color
	     * @return {string}
	     * @memberOf module:zrender/util/color
	     */
	    function toHex(color, level) {
	        var colorArr = parse(color);
	        if (colorArr) {
	            return ((1 << 24) + (colorArr[0] << 16) + (colorArr[1] << 8) + (+colorArr[2])).toString(16).slice(1);
	        }
	    }
	
	    /**
	     * Map value to color. Faster than mapToColor methods because color is represented by rgba array
	     * @param {number} normalizedValue A float between 0 and 1.
	     * @param {Array.<Array.<number>>} colors List of rgba color array
	     * @param {Array.<number>} [out] Mapped gba color array
	     * @return {Array.<number>}
	     */
	    function fastMapToColor(normalizedValue, colors, out) {
	        if (!(colors && colors.length)
	            || !(normalizedValue >= 0 && normalizedValue <= 1)
	        ) {
	            return;
	        }
	        out = out || [0, 0, 0, 0];
	        var value = normalizedValue * (colors.length - 1);
	        var leftIndex = Math.floor(value);
	        var rightIndex = Math.ceil(value);
	        var leftColor = colors[leftIndex];
	        var rightColor = colors[rightIndex];
	        var dv = value - leftIndex;
	        out[0] = clampCssByte(lerp(leftColor[0], rightColor[0], dv));
	        out[1] = clampCssByte(lerp(leftColor[1], rightColor[1], dv));
	        out[2] = clampCssByte(lerp(leftColor[2], rightColor[2], dv));
	        out[3] = clampCssByte(lerp(leftColor[3], rightColor[3], dv));
	        return out;
	    }
	    /**
	     * @param {number} normalizedValue A float between 0 and 1.
	     * @param {Array.<string>} colors Color list.
	     * @param {boolean=} fullOutput Default false.
	     * @return {(string|Object)} Result color. If fullOutput,
	     *                           return {color: ..., leftIndex: ..., rightIndex: ..., value: ...},
	     * @memberOf module:zrender/util/color
	     */
	    function mapToColor(normalizedValue, colors, fullOutput) {
	        if (!(colors && colors.length)
	            || !(normalizedValue >= 0 && normalizedValue <= 1)
	        ) {
	            return;
	        }
	
	        var value = normalizedValue * (colors.length - 1);
	        var leftIndex = Math.floor(value);
	        var rightIndex = Math.ceil(value);
	        var leftColor = parse(colors[leftIndex]);
	        var rightColor = parse(colors[rightIndex]);
	        var dv = value - leftIndex;
	
	        var color = stringify(
	            [
	                clampCssByte(lerp(leftColor[0], rightColor[0], dv)),
	                clampCssByte(lerp(leftColor[1], rightColor[1], dv)),
	                clampCssByte(lerp(leftColor[2], rightColor[2], dv)),
	                clampCssFloat(lerp(leftColor[3], rightColor[3], dv))
	            ],
	            'rgba'
	        );
	
	        return fullOutput
	            ? {
	                color: color,
	                leftIndex: leftIndex,
	                rightIndex: rightIndex,
	                value: value
	            }
	            : color;
	    }
	
	    /**
	     * @param {string} color
	     * @param {number=} h 0 ~ 360, ignore when null.
	     * @param {number=} s 0 ~ 1, ignore when null.
	     * @param {number=} l 0 ~ 1, ignore when null.
	     * @return {string} Color string in rgba format.
	     * @memberOf module:zrender/util/color
	     */
	    function modifyHSL(color, h, s, l) {
	        color = parse(color);
	
	        if (color) {
	            color = rgba2hsla(color);
	            h != null && (color[0] = clampCssAngle(h));
	            s != null && (color[1] = parseCssFloat(s));
	            l != null && (color[2] = parseCssFloat(l));
	
	            return stringify(hsla2rgba(color), 'rgba');
	        }
	    }
	
	    /**
	     * @param {string} color
	     * @param {number=} alpha 0 ~ 1
	     * @return {string} Color string in rgba format.
	     * @memberOf module:zrender/util/color
	     */
	    function modifyAlpha(color, alpha) {
	        color = parse(color);
	
	        if (color && alpha != null) {
	            color[3] = clampCssFloat(alpha);
	            return stringify(color, 'rgba');
	        }
	    }
	
	    /**
	     * @param {Array.<string>} colors Color list.
	     * @param {string} type 'rgba', 'hsva', ...
	     * @return {string} Result color.
	     */
	    function stringify(arrColor, type) {
	        var colorStr = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2];
	        if (type === 'rgba' || type === 'hsva' || type === 'hsla') {
	            colorStr += ',' + arrColor[3];
	        }
	        return type + '(' + colorStr + ')';
	    }
	
	    module.exports = {
	        parse: parse,
	        lift: lift,
	        toHex: toHex,
	        fastMapToColor: fastMapToColor,
	        mapToColor: mapToColor,
	        modifyHSL: modifyHSL,
	        modifyAlpha: modifyAlpha,
	        stringify: stringify
	    };
	
	


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	        var config = __webpack_require__(17);
	
	        /**
	         * @exports zrender/tool/log
	         * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	         */
	        module.exports = function() {
	            if (config.debugMode === 0) {
	                return;
	            }
	            else if (config.debugMode == 1) {
	                for (var k in arguments) {
	                    throw new Error(arguments[k]);
	                }
	            }
	            else if (config.debugMode > 1) {
	                for (var k in arguments) {
	                    console.log(arguments[k]);
	                }
	            }
	        };
	
	        
	    


/***/ },
/* 17 */
/***/ function(module, exports) {

	
	    var dpr = 1;
	    
	    /**
	     * config默认配置项
	     * @exports zrender/config
	     * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	     */
	    var config = {
	        /**
	         * debug日志选项：catchBrushException为true下有效
	         * 0 : 不生成debug数据，发布用
	         * 1 : 异常抛出，调试用
	         * 2 : 控制台输出，调试用
	         */
	        debugMode: 2,
	
	        // retina 屏幕优化
	        devicePixelRatio: dpr
	    };
	    module.exports = config;
	
	


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @module echarts/core/BoundingRect
	 */
	
	
	    var vec2 = __webpack_require__(2);
	    var matrix = __webpack_require__(10);
	
	    var v2ApplyTransform = vec2.applyTransform;
	    var mathMin = Math.min;
	    var mathMax = Math.max;
	    /**
	     * @alias module:echarts/core/BoundingRect
	     */
	    function BoundingRect(x, y, width, height) {
	
	        if (width < 0) {
	            x = x + width;
	            width = -width;
	        }
	        if (height < 0) {
	            y = y + height;
	            height = -height;
	        }
	
	        /**
	         * @type {number}
	         */
	        this.x = x;
	        /**
	         * @type {number}
	         */
	        this.y = y;
	        /**
	         * @type {number}
	         */
	        this.width = width;
	        /**
	         * @type {number}
	         */
	        this.height = height;
	    }
	
	    BoundingRect.prototype = {
	
	        constructor: BoundingRect,
	
	        /**
	         * @param {module:echarts/core/BoundingRect} other
	         */
	        union: function (other) {
	            var x = mathMin(other.x, this.x);
	            var y = mathMin(other.y, this.y);
	
	            this.width = mathMax(
	                    other.x + other.width,
	                    this.x + this.width
	                ) - x;
	            this.height = mathMax(
	                    other.y + other.height,
	                    this.y + this.height
	                ) - y;
	            this.x = x;
	            this.y = y;
	        },
	
	        /**
	         * @param {Array.<number>} m
	         * @methods
	         */
	        applyTransform: (function () {
	            var lt = [];
	            var rb = [];
	            var lb = [];
	            var rt = [];
	            return function (m) {
	                // In case usage like this
	                // el.getBoundingRect().applyTransform(el.transform)
	                // And element has no transform
	                if (!m) {
	                    return;
	                }
	                lt[0] = lb[0] = this.x;
	                lt[1] = rt[1] = this.y;
	                rb[0] = rt[0] = this.x + this.width;
	                rb[1] = lb[1] = this.y + this.height;
	
	                v2ApplyTransform(lt, lt, m);
	                v2ApplyTransform(rb, rb, m);
	                v2ApplyTransform(lb, lb, m);
	                v2ApplyTransform(rt, rt, m);
	
	                this.x = mathMin(lt[0], rb[0], lb[0], rt[0]);
	                this.y = mathMin(lt[1], rb[1], lb[1], rt[1]);
	                var maxX = mathMax(lt[0], rb[0], lb[0], rt[0]);
	                var maxY = mathMax(lt[1], rb[1], lb[1], rt[1]);
	                this.width = maxX - this.x;
	                this.height = maxY - this.y;
	            };
	        })(),
	
	        /**
	         * Calculate matrix of transforming from self to target rect
	         * @param  {module:zrender/core/BoundingRect} b
	         * @return {Array.<number>}
	         */
	        calculateTransform: function (b) {
	            var a = this;
	            var sx = b.width / a.width;
	            var sy = b.height / a.height;
	
	            var m = matrix.create();
	
	            // 矩阵右乘
	            matrix.translate(m, m, [-a.x, -a.y]);
	            matrix.scale(m, m, [sx, sy]);
	            matrix.translate(m, m, [b.x, b.y]);
	
	            return m;
	        },
	
	        /**
	         * @param {(module:echarts/core/BoundingRect|Object)} b
	         * @return {boolean}
	         */
	        intersect: function (b) {
	            if (!b) {
	                return false;
	            }
	
	            if (!(b instanceof BoundingRect)) {
	                // Normalize negative width/height.
	                b = BoundingRect.create(b);
	            }
	
	            var a = this;
	            var ax0 = a.x;
	            var ax1 = a.x + a.width;
	            var ay0 = a.y;
	            var ay1 = a.y + a.height;
	
	            var bx0 = b.x;
	            var bx1 = b.x + b.width;
	            var by0 = b.y;
	            var by1 = b.y + b.height;
	
	            return ! (ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
	        },
	
	        contain: function (x, y) {
	            var rect = this;
	            return x >= rect.x
	                && x <= (rect.x + rect.width)
	                && y >= rect.y
	                && y <= (rect.y + rect.height);
	        },
	
	        /**
	         * @return {module:echarts/core/BoundingRect}
	         */
	        clone: function () {
	            return new BoundingRect(this.x, this.y, this.width, this.height);
	        },
	
	        /**
	         * Copy from another rect
	         */
	        copy: function (other) {
	            this.x = other.x;
	            this.y = other.y;
	            this.width = other.width;
	            this.height = other.height;
	        },
	
	        plain: function () {
	            return {
	                x: this.x,
	                y: this.y,
	                width: this.width,
	                height: this.height
	            };
	        }
	    };
	
	    /**
	     * @param {Object|module:zrender/core/BoundingRect} rect
	     * @param {number} rect.x
	     * @param {number} rect.y
	     * @param {number} rect.width
	     * @param {number} rect.height
	     * @return {module:zrender/core/BoundingRect}
	     */
	    BoundingRect.create = function (rect) {
	        return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
	    };
	
	    module.exports = BoundingRect;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 圆弧
	 * @module zrender/graphic/shape/Arc
	 */
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'arc',
	
	    shape: {
	
	        cx: 0,
	
	        cy: 0,
	
	        r: 0,
	
	        startAngle: 0,
	
	        endAngle: Math.PI * 2,
	
	        clockwise: true
	    },
	
	    style: {
	
	        stroke: '#000000',
	
	        fill: null
	    },
	
	    buildPath: function (ctx, shape) {
	
	        var x = shape.cx;
	        var y = shape.cy;
	        var r = Math.max(shape.r, 0);
	        var startAngle = shape.startAngle;
	        var endAngle = shape.endAngle;
	        var clockwise = shape.clockwise;
	
	        var unitX = Math.cos(startAngle);
	        var unitY = Math.sin(startAngle);
	
	        ctx.moveTo(unitX * r + x, unitY * r + y);
	        ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
	    }
	});


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Path element
	 * @module zrender/graphic/Path
	 */
	 var log = __webpack_require__(16);
	
	
	    var Displayable = __webpack_require__(21);
	    var zrUtil = __webpack_require__(5);
	    var PathProxy = __webpack_require__(25);
	    var pathContain = __webpack_require__(26);
	
	    var Pattern = __webpack_require__(33);
	    var getCanvasPattern = Pattern.prototype.getCanvasPattern;
	
	    var abs = Math.abs;
	
	    /**
	     * @alias module:zrender/graphic/Path
	     * @extends module:zrender/graphic/Displayable
	     * @constructor
	     * @param {Object} opts
	     */
	    function Path(opts) {
	        Displayable.call(this, opts);
	
	        /**
	         * @type {module:zrender/core/PathProxy}
	         * @readOnly
	         */
	        this.path = new PathProxy();
	    }
	
	    Path.prototype = {
	
	        constructor: Path,
	
	        type: 'path',
	
	        __dirtyPath: true,
	
	        strokeContainThreshold: 5,
	
	        brush: function (ctx, prevEl) {
	            var style = this.style;
	            var path = this.path;
	            var hasStroke = style.hasStroke();
	            var hasFill = style.hasFill();
	            var fill = style.fill;
	            var stroke = style.stroke;
	            var hasFillGradient = hasFill && !!(fill.colorStops);
	            var hasStrokeGradient = hasStroke && !!(stroke.colorStops);
	            var hasFillPattern = hasFill && !!(fill.image);
	            var hasStrokePattern = hasStroke && !!(stroke.image);
	
	            style.bind(ctx, this, prevEl);
	            this.setTransform(ctx);
	
	            if (this.__dirty) {
	                var rect = this.getBoundingRect();
	                // Update gradient because bounding rect may changed
	                if (hasFillGradient) {					
	                    this._fillGradient = style.getGradient(ctx, fill, rect);
	                }
	                if (hasStrokeGradient) {
	                    this._strokeGradient = style.getGradient(ctx, stroke, rect);
	                }
	            }
	            // Use the gradient or pattern
	            if (hasFillGradient) {
	                // PENDING If may have affect the state
	                ctx.setFillStyle(this._fillGradient);
	            }
	            else if (hasFillPattern) {
	                ctx.setFillStyle(getCanvasPattern.call(fill, ctx));
	            }
	            if (hasStrokeGradient) {
	                ctx.setStrokeStyle(this._strokeGradient);
	            }
	            else if (hasStrokePattern) {
	                ctx.setStrokeStyle(getCanvasPattern.call(stroke, ctx));
	            }
	
	            var lineDash = style.lineDash;
	            var lineDashOffset = style.lineDashOffset;
	
	            var ctxLineDash = !!ctx.setLineDash;
	
	            // Update path sx, sy
	            var scale = this.getGlobalScale();
	            path.setScale(scale[0], scale[1]);
	
	            // Proxy context
	            // Rebuild path in following 2 cases
	            // 1. Path is dirty
	            // 2. Path needs javascript implemented lineDash stroking.
	            //    In this case, lineDash information will not be saved in PathProxy
	            if (this.__dirtyPath || (
	                lineDash && !ctxLineDash && hasStroke
	            )) {
	                path = this.path.beginPath(ctx);
	
	                // Setting line dash before build path
	                if (lineDash && !ctxLineDash) {
	                    path.setLineDash(lineDash);
	                    path.setLineDashOffset(lineDashOffset);
	                }
	
	                this.buildPath(path, this.shape, false);
	
	                // Clear path dirty flag
	                this.__dirtyPath = false;
	            }
	            else {
	                // Replay path building
	                ctx.beginPath();
	                this.path.rebuildPath(ctx);
	            }
	
	            hasFill && path.fill(ctx);
	
	            if (lineDash && ctxLineDash) {
	                ctx.setLineDash(lineDash);
	                ctx.lineDashOffset = lineDashOffset;
	            }
				
				/*** we ***/
				var lineWidth = style.lineWidth;
				if (hasStroke) {
					ctx.setLineWidth(lineWidth);
				}				
				
				var shadowBlur = style.shadowBlur;
				var shadowOffsetX = style.shadowOffsetX || 0;
				var shadowOffsetY = style.shadowOffsetY || 0;
				var shadowColor = style.shadowColor || '#000000';
				
				if (shadowBlur) {
					ctx.setShadow(shadowBlur, shadowOffsetX, shadowOffsetY, shadowColor);
				}
				
				var lineCap = style.lineCap;
				
				if (lineCap) {
					ctx.setLineCap(lineCap);
				}
				
				var lineJoin = style.lineJoin;
				
				if (lineJoin) {
					ctx.setLineJoin(lineJoin);
				}
				
				var miterLimit = style.miterLimit;
				
				if (miterLimit) {
					ctx.setMiterLimit(miterLimit);
				}
	
				/*** we ***/
	            
	
	            hasStroke && path.stroke(ctx);
	
	            if (lineDash && ctxLineDash) {
	                // PENDING
	                // Remove lineDash
	                ctx.setLineDash([]);
	            }
	
	
	            this.restoreTransform(ctx);
	
	            // Draw rect text
	            if (style.text != null) {
	                // var rect = this.getBoundingRect();
	                this.drawRectText(ctx, this.getBoundingRect());
	            }
	        },
	
	        // When bundling path, some shape may decide if use moveTo to begin a new subpath or closePath
	        // Like in circle
	        buildPath: function (ctx, shapeCfg, inBundle) {},
	
	        getBoundingRect: function () {
	            var rect = this._rect;
	            var style = this.style;
	            var needsUpdateRect = !rect;
	            if (needsUpdateRect) {
	                var path = this.path;
	                if (this.__dirtyPath) {
	                    path.beginPath();
	                    this.buildPath(path, this.shape, false);
	                }
	                rect = path.getBoundingRect();
	            }
	            this._rect = rect;
	
	            if (style.hasStroke()) {
	                // Needs update rect with stroke lineWidth when
	                // 1. Element changes scale or lineWidth
	                // 2. Shape is changed
	                var rectWithStroke = this._rectWithStroke || (this._rectWithStroke = rect.clone());
	                if (this.__dirty || needsUpdateRect) {
	                    rectWithStroke.copy(rect);
	                    // FIXME Must after updateTransform
	                    var w = style.lineWidth;
	                    // PENDING, Min line width is needed when line is horizontal or vertical
	                    var lineScale = style.strokeNoScale ? this.getLineScale() : 1;
	
	                    // Only add extra hover lineWidth when there are no fill
	                    if (!style.hasFill()) {
	                        w = Math.max(w, this.strokeContainThreshold || 4);
	                    }
	                    // Consider line width
	                    // Line scale can't be 0;
	                    if (lineScale > 1e-10) {
	                        rectWithStroke.width += w / lineScale;
	                        rectWithStroke.height += w / lineScale;
	                        rectWithStroke.x -= w / lineScale / 2;
	                        rectWithStroke.y -= w / lineScale / 2;
	                    }
	                }
	
	                // Return rect with stroke
	                return rectWithStroke;
	            }
	
	            return rect;
	        },
	
	        contain: function (x, y) {
	            var localPos = this.transformCoordToLocal(x, y);
	            var rect = this.getBoundingRect();
	            var style = this.style;
	            x = localPos[0];
	            y = localPos[1];
	
	            if (rect.contain(x, y)) {
	                var pathData = this.path.data;
	                if (style.hasStroke()) {
	                    var lineWidth = style.lineWidth;
	                    var lineScale = style.strokeNoScale ? this.getLineScale() : 1;
	                    // Line scale can't be 0;
	                    if (lineScale > 1e-10) {
	                        // Only add extra hover lineWidth when there are no fill
	                        if (!style.hasFill()) {
	                            lineWidth = Math.max(lineWidth, this.strokeContainThreshold);
	                        }
	                        if (pathContain.containStroke(
	                            pathData, lineWidth / lineScale, x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                }
	                if (style.hasFill()) {
	                    return pathContain.contain(pathData, x, y);
	                }
	            }
	            return false;
	        },
	
	        /**
	         * @param  {boolean} dirtyPath
	         */
	        dirty: function (dirtyPath) {
	            if (dirtyPath == null) {
	                dirtyPath = true;
	            }
	            // Only mark dirty, not mark clean
	            if (dirtyPath) {
	                this.__dirtyPath = dirtyPath;
	                this._rect = null;
	            }
	
	            this.__dirty = true;
	
	            this.__zr && this.__zr.refresh();
	
	            // Used as a clipping path
	            if (this.__clipTarget) {
	                this.__clipTarget.dirty();
	            }
	        },
	
	        /**
	         * Alias for animate('shape')
	         * @param {boolean} loop
	         */
	        animateShape: function (loop) {
	            return this.animate('shape', loop);
	        },
	
	        // Overwrite attrKV
	        attrKV: function (key, value) {
	            // FIXME
	            if (key === 'shape') {
	                this.setShape(value);
	                this.__dirtyPath = true;
	                this._rect = null;
	            }
	            else {
	                Displayable.prototype.attrKV.call(this, key, value);
	            }
	        },
	
	        /**
	         * @param {Object|string} key
	         * @param {*} value
	         */
	        setShape: function (key, value) {
	            var shape = this.shape;
	            // Path from string may not have shape
	            if (shape) {
	                if (zrUtil.isObject(key)) {
	                    for (var name in key) {
	                        if (key.hasOwnProperty(name)) {
	                            shape[name] = key[name];
	                        }
	                    }
	                }
	                else {
	                    shape[key] = value;
	                }
	                this.dirty(true);
	            }
	            return this;
	        },
	
	        getLineScale: function () {
	            var m = this.transform;
	            // Get the line scale.
	            // Determinant of `m` means how much the area is enlarged by the
	            // transformation. So its square root can be used as a scale factor
	            // for width.
	            return m && abs(m[0] - 1) > 1e-10 && abs(m[3] - 1) > 1e-10
	                ? Math.sqrt(abs(m[0] * m[3] - m[2] * m[1]))
	                : 1;
	        }
	    };
	
	    /**
	     * 扩展一个 Path element, 比如星形，圆等。
	     * Extend a path element
	     * @param {Object} props
	     * @param {string} props.type Path type
	     * @param {Function} props.init Initialize
	     * @param {Function} props.buildPath Overwrite buildPath method
	     * @param {Object} [props.style] Extended default style config
	     * @param {Object} [props.shape] Extended default shape config
	     */
	    Path.extend = function (defaults) {
	        var Sub = function (opts) {
	            Path.call(this, opts);
	
	            if (defaults.style) {
	                // Extend default style
	                this.style.extendFrom(defaults.style, false);
	            }
	
	            // Extend default shape
	            var defaultShape = defaults.shape;
	            if (defaultShape) {
	                this.shape = this.shape || {};
	                var thisShape = this.shape;
	                for (var name in defaultShape) {
	                    if (
	                        ! thisShape.hasOwnProperty(name)
	                        && defaultShape.hasOwnProperty(name)
	                    ) {
	                        thisShape[name] = defaultShape[name];
	                    }
	                }
	            }
	
	            defaults.init && defaults.init.call(this, opts);
	        };
	
	        zrUtil.inherits(Sub, Path);
	
	        // FIXME 不能 extend position, rotation 等引用对象
	        for (var name in defaults) {
	            // Extending prototype values and methods
	            if (name !== 'style' && name !== 'shape') {
	                Sub.prototype[name] = defaults[name];
	            }
	        }
	
	        return Sub;
	    };
	
	    zrUtil.inherits(Path, Displayable);
	
	    module.exports = Path;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 可绘制的图形基类
	 * Base class of all displayable graphic objects
	 * @module zrender/graphic/Displayable
	 */
	
	
	
	    var zrUtil = __webpack_require__(5);
	
	    var Style = __webpack_require__(22);
	
	    var Element = __webpack_require__(6);
	    var RectText = __webpack_require__(23);
	    // var Stateful = require('./mixin/Stateful');
	
	    /**
	     * @alias module:zrender/graphic/Displayable
	     * @extends module:zrender/Element
	     * @extends module:zrender/graphic/mixin/RectText
	     */
	    function Displayable(opts) {
	
	        opts = opts || {};
	
	        Element.call(this, opts);
	
	        // Extend properties
	        for (var name in opts) {
	            if (
	                opts.hasOwnProperty(name) &&
	                name !== 'style'
	            ) {
	                this[name] = opts[name];
	            }
	        }
	
	        /**
	         * @type {module:zrender/graphic/Style}
	         */
	        this.style = new Style(opts.style);
	
	        this._rect = null;
	        // Shapes for cascade clipping.
	        this.__clipPaths = [];
	
	        // FIXME Stateful must be mixined after style is setted
	        // Stateful.call(this, opts);
	    }
	
	    Displayable.prototype = {
	
	        constructor: Displayable,
	
	        type: 'displayable',
	
	        /**
	         * Displayable 是否为脏，Painter 中会根据该标记判断是否需要是否需要重新绘制
	         * Dirty flag. From which painter will determine if this displayable object needs brush
	         * @name module:zrender/graphic/Displayable#__dirty
	         * @type {boolean}
	         */
	        __dirty: true,
	
	        /**
	         * 图形是否可见，为true时不绘制图形，但是仍能触发鼠标事件
	         * If ignore drawing of the displayable object. Mouse event will still be triggered
	         * @name module:/zrender/graphic/Displayable#invisible
	         * @type {boolean}
	         * @default false
	         */
	        invisible: false,
	
	        /**
	         * @name module:/zrender/graphic/Displayable#z
	         * @type {number}
	         * @default 0
	         */
	        z: 0,
	
	        /**
	         * @name module:/zrender/graphic/Displayable#z
	         * @type {number}
	         * @default 0
	         */
	        z2: 0,
	
	        /**
	         * z层level，决定绘画在哪层canvas中
	         * @name module:/zrender/graphic/Displayable#zlevel
	         * @type {number}
	         * @default 0
	         */
	        zlevel: 0,
	
	        /**
	         * 是否可拖拽
	         * @name module:/zrender/graphic/Displayable#draggable
	         * @type {boolean}
	         * @default false
	         */
	        draggable: false,
	
	        /**
	         * 是否正在拖拽
	         * @name module:/zrender/graphic/Displayable#draggable
	         * @type {boolean}
	         * @default false
	         */
	        dragging: false,
	
	        /**
	         * 是否相应鼠标事件
	         * @name module:/zrender/graphic/Displayable#silent
	         * @type {boolean}
	         * @default false
	         */
	        silent: false,
	
	        /**
	         * If enable culling
	         * @type {boolean}
	         * @default false
	         */
	        culling: false,
	
	        /**
	         * Mouse cursor when hovered
	         * @name module:/zrender/graphic/Displayable#cursor
	         * @type {string}
	         */
	        cursor: 'pointer',
	
	        /**
	         * If hover area is bounding rect
	         * @name module:/zrender/graphic/Displayable#rectHover
	         * @type {string}
	         */
	        rectHover: false,
	
	        /**
	         * Render the element progressively when the value >= 0,
	         * usefull for large data.
	         * @type {number}
	         */
	        progressive: -1,
	
	        beforeBrush: function (ctx) {},
	
	        afterBrush: function (ctx) {},
	
	        /**
	         * 图形绘制方法
	         * @param {Canvas2DRenderingContext} ctx
	         */
	        // Interface
	        brush: function (ctx, prevEl) {},
	
	        /**
	         * 获取最小包围盒
	         * @return {module:zrender/core/BoundingRect}
	         */
	        // Interface
	        getBoundingRect: function () {},
	
	        /**
	         * 判断坐标 x, y 是否在图形上
	         * If displayable element contain coord x, y
	         * @param  {number} x
	         * @param  {number} y
	         * @return {boolean}
	         */
	        contain: function (x, y) {
	            return this.rectContain(x, y);
	        },
	
	        /**
	         * @param  {Function} cb
	         * @param  {}   context
	         */
	        traverse: function (cb, context) {
	            cb.call(context, this);
	        },
	
	        /**
	         * 判断坐标 x, y 是否在图形的包围盒上
	         * If bounding rect of element contain coord x, y
	         * @param  {number} x
	         * @param  {number} y
	         * @return {boolean}
	         */
	        rectContain: function (x, y) {
	            var coord = this.transformCoordToLocal(x, y);
	            var rect = this.getBoundingRect();
	            return rect.contain(coord[0], coord[1]);
	        },
	
	        /**
	         * 标记图形元素为脏，并且在下一帧重绘
	         * Mark displayable element dirty and refresh next frame
	         */
	        dirty: function () {
	            this.__dirty = true;
	
	            this._rect = null;
	
	            this.__zr && this.__zr.refresh();
	        },
	
	        /**
	         * 图形是否会触发事件
	         * If displayable object binded any event
	         * @return {boolean}
	         */
	        // TODO, 通过 bind 绑定的事件
	        // isSilent: function () {
	        //     return !(
	        //         this.hoverable || this.draggable
	        //         || this.onmousemove || this.onmouseover || this.onmouseout
	        //         || this.onmousedown || this.onmouseup || this.onclick
	        //         || this.ondragenter || this.ondragover || this.ondragleave
	        //         || this.ondrop
	        //     );
	        // },
	        /**
	         * Alias for animate('style')
	         * @param {boolean} loop
	         */
	        animateStyle: function (loop) {
	            return this.animate('style', loop);
	        },
	
	        attrKV: function (key, value) {
	            if (key !== 'style') {
	                Element.prototype.attrKV.call(this, key, value);
	            }
	            else {
	                this.style.set(value);
	            }
	        },
	
	        /**
	         * @param {Object|string} key
	         * @param {*} value
	         */
	        setStyle: function (key, value) {
	            this.style.set(key, value);
	            this.dirty(false);
	            return this;
	        },
	
	        /**
	         * Use given style object
	         * @param  {Object} obj
	         */
	        useStyle: function (obj) {
	            this.style = new Style(obj);
	            this.dirty(false);
	            return this;
	        }
	    };
	
	    zrUtil.inherits(Displayable, Element);
	
	    zrUtil.mixin(Displayable, RectText);
	    // zrUtil.mixin(Displayable, Stateful);
	
	    module.exports = Displayable;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @module zrender/graphic/Style
	 */
	
	 var log = __webpack_require__(16);
	
	    var STYLE_COMMON_PROPS = [
	        ['shadowBlur', 0], ['shadowOffsetX', 0], ['shadowOffsetY', 0], ['shadowColor', '#000000'],
	        ['lineCap', 'butt'], ['lineJoin', 'miter'], ['miterLimit', 10]
	    ];
	
	    // var SHADOW_PROPS = STYLE_COMMON_PROPS.slice(0, 4);
	    // var LINE_PROPS = STYLE_COMMON_PROPS.slice(4);
	
	    var Style = function (opts) {
	        this.extendFrom(opts);
	    };
	
	    function createLinearGradient(ctx, obj, rect) {		
	        // var size =
	        var x = obj.x;
	        var x2 = obj.x2;
	        var y = obj.y;
	        var y2 = obj.y2;
	
	        if (!obj.global) {
	            x = x * rect.width + rect.x;
	            x2 = x2 * rect.width + rect.x;
	            y = y * rect.height + rect.y;
	            y2 = y2 * rect.height + rect.y;
	        }
	
	        var canvasGradient = ctx.createLinearGradient(x, y, x2, y2);
	
	        return canvasGradient;
	    }
	
	    function createRadialGradient(ctx, obj, rect) {
	        var width = rect.width;
	        var height = rect.height;
	        var min = Math.min(width, height);
	
	        var x = obj.x;
	        var y = obj.y;
	        var r = obj.r;
	        if (!obj.global) {
	            x = x * width + rect.x;
	            y = y * height + rect.y;
	            r = r * min;
	        }
	
	        var canvasGradient = ctx.createRadialGradient(x, y, 0, x, y, r);
	
	        return canvasGradient;
	    }
	
	
	    Style.prototype = {
	
	        constructor: Style,
	
	        /**
	         * @type {string}
	         */
	        fill: '#000000',
	
	        /**
	         * @type {string}
	         */
	        stroke: null,
	
	        /**
	         * @type {number}
	         */
	        opacity: 1,
	
	        /**
	         * @type {Array.<number>}
	         */
	        lineDash: null,
	
	        /**
	         * @type {number}
	         */
	        lineDashOffset: 0,
	
	        /**
	         * @type {number}
	         */
	        shadowBlur: 0,
	
	        /**
	         * @type {number}
	         */
	        shadowOffsetX: 0,
	
	        /**
	         * @type {number}
	         */
	        shadowOffsetY: 0,
	
	        /**
	         * @type {number}
	         */
	        lineWidth: 1,
	
	        /**
	         * If stroke ignore scale
	         * @type {Boolean}
	         */
	        strokeNoScale: false,
	
	        // Bounding rect text configuration
	        // Not affected by element transform
	        /**
	         * @type {string}
	         */
	        text: null,
	
	        /**
	         * @type {string}
	         */
	         textFill: '#000000',
	
	        /**
	         * @type {string}
	         */
	        textStroke: null,
	
	        /**
	         * 'inside', 'left', 'right', 'top', 'bottom'
	         * [x, y]
	         * @type {string|Array.<number>}
	         * @default 'inside'
	         */
	        textPosition: 'inside',
	
	        /**
	         * @type {string}
	         */
	        textBaseline: null,
	
	        /**
	         * @type {string}
	         */
	        textAlign: null,
	
	        /**
	         * @type {string}
	         */
	        textVerticalAlign: null,
	
	        /**
	         * Only useful in Path and Image element
	         * @type {number}
	         */
	        textDistance: 5,
	
	        /**
	         * Only useful in Path and Image element
	         * @type {number}
	         */
	        textShadowBlur: 0,
	
	        /**
	         * Only useful in Path and Image element
	         * @type {number}
	         */
	        textShadowOffsetX: 0,
	
	        /**
	         * Only useful in Path and Image element
	         * @type {number}
	         */
	        textShadowOffsetY: 0,
	
	        /**
	         * If transform text
	         * Only useful in Path and Image element
	         * @type {boolean}
	         */
	        textTransform: false,
	
	        /**
	         * Text rotate around position of Path or Image
	         * Only useful in Path and Image element and textTransform is false.
	         */
	        textRotation: 0,
	
	        /**
	         * @type {string}
	         * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
	         */
	        blend: null,
	
	        /**
	         * @param {CanvasRenderingContext2D} ctx
	         */
	        bind: function (ctx, el, prevEl) {
	            var style = this;
	            var prevStyle = prevEl && prevEl.style;
	            var firstDraw = !prevStyle;
	
	            for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
	                var prop = STYLE_COMMON_PROPS[i];
	                var styleName = prop[0];
	
	                if (firstDraw || style[styleName] !== prevStyle[styleName]) {
	                    // FIXME Invalid property value will cause style leak from previous element.
	                    ctx[styleName] = style[styleName] || prop[1];
	                }
	            } 
	            if ((firstDraw || style.fill !== prevStyle.fill)) {                
	                ctx.setFillStyle(style.fill);
	            }
	            if ((firstDraw || style.stroke !== prevStyle.stroke)) {
	                ctx.setStrokeStyle(style.stroke);
	            }
	            if ((firstDraw || style.opacity !== prevStyle.opacity)) {
	                ctx.setGlobalAlpha(style.opacity == null ? 1 : style.opacity);
	            }
	  
	
	            if ((firstDraw || style.blend !== prevStyle.blend)) {
	                ctx.globalCompositeOperation = style.blend || 'source-over';
	            }
	            if (this.hasStroke()) {
	                var lineWidth = style.lineWidth;
	                ctx.lineWidth = lineWidth / (
	                    (this.strokeNoScale && el && el.getLineScale) ? el.getLineScale() : 1
	                );
	            }
	        },
	
	        hasFill: function () {
	            var fill = this.fill;
	            return fill != null && fill !== 'none';
	        },
	
	        hasStroke: function () {
	            var stroke = this.stroke;
	            return stroke != null && stroke !== 'none' && this.lineWidth > 0;
	        },
	
	        /**
	         * Extend from other style
	         * @param {zrender/graphic/Style} otherStyle
	         * @param {boolean} overwrite
	         */
	        extendFrom: function (otherStyle, overwrite) {
	            if (otherStyle) {
	                var target = this;
	                for (var name in otherStyle) {
	                    if (otherStyle.hasOwnProperty(name)
	                        && (overwrite || ! target.hasOwnProperty(name))
	                    ) {
	                        target[name] = otherStyle[name];
	                    }
	                }
	            }
	        },
	
	        /**
	         * Batch setting style with a given object
	         * @param {Object|string} obj
	         * @param {*} [obj]
	         */
	        set: function (obj, value) {
	            if (typeof obj === 'string') {
	                this[obj] = value;
	            }
	            else {
	                this.extendFrom(obj, true);
	            }
	        },
	
	        /**
	         * Clone
	         * @return {zrender/graphic/Style} [description]
	         */
	        clone: function () {
	            var newStyle = new this.constructor();
	            newStyle.extendFrom(this, true);
	            return newStyle;
	        },
	
	        getGradient: function (ctx, obj, rect) {			
	            var method = obj.type === 'radial' ? createRadialGradient : createLinearGradient;
	            var canvasGradient = method(ctx, obj, rect);
				
	            var colorStops = obj.colorStops;
	            for (var i = 0; i < colorStops.length; i++) {
	                canvasGradient.addColorStop(
	                    colorStops[i].offset, colorStops[i].color
	                );
	            }	
				
	            return canvasGradient;
	        }
	    };
	
	    var styleProto = Style.prototype;
	    for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
	        var prop = STYLE_COMMON_PROPS[i];
	        if (!(prop[0] in styleProto)) {
	            styleProto[prop[0]] = prop[1];
	        }
	    }
	
	    // Provide for others
	    Style.getGradient = styleProto.getGradient;
	
	    module.exports = Style;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Mixin for drawing text in a element bounding rect
	 * @module zrender/mixin/RectText
	 */
	
	
		var log = __webpack_require__(16);
	    var textContain = __webpack_require__(24);
	    var BoundingRect = __webpack_require__(18);
	
	    var tmpRect = new BoundingRect();
	
	    var RectText = function () {};
	
	    function parsePercent(value, maxValue) {
	        if (typeof value === 'string') {
	            if (value.lastIndexOf('%') >= 0) {
	                return parseFloat(value) / 100 * maxValue;
	            }
	            return parseFloat(value);
	        }
	        return value;
	    }
	
	    RectText.prototype = {
	
	        constructor: RectText,
	
	        /**
	         * Draw text in a rect with specified position.
	         * @param  {CanvasRenderingContext} ctx
	         * @param  {Object} rect Displayable rect
	         * @return {Object} textRect Alternative precalculated text bounding rect
	         */
	        drawRectText: function (ctx, rect, textRect) {			
	            var style = this.style;
	
	            var text = style.text;
	            // Convert to string
	            text != null && (text += '');
	            if (!text) {
	                return;
	            }
	
	            // FIXME
	            ctx.save();
	
	            var x;
	            var y;
	            var textPosition = style.textPosition;
	            var distance = style.textDistance;
	            var align = style.textAlign;
	            var font = style.textFont || style.font;
	            var baseline = style.textBaseline;
	            var verticalAlign = style.textVerticalAlign;
	
	            textRect = textRect || textContain.getBoundingRect(text, font, align, baseline);	
	
							
	            // Transform rect to view space
				
	            var transform = this.transform;
	
	            if (!style.textTransform) {
	                if (transform) {
	                    tmpRect.copy(rect);
	                    tmpRect.applyTransform(transform);
	                    rect = tmpRect;
	                }
	            }
	            else {
	                this.setTransform(ctx);
	            }
	
	
	            // Text position represented by coord
	            if (textPosition instanceof Array) {
	                // Percent
	                x = rect.x + parsePercent(textPosition[0], rect.width);
	                y = rect.y + parsePercent(textPosition[1], rect.height);
	                align = align || 'left';
	                baseline = baseline || 'top';
	
	                if (verticalAlign) {
	                    switch (verticalAlign) {
	                        case 'middle':
	                            y -= textRect.height / 2 - textRect.lineHeight / 2;
	                            break;
	                        case 'bottom':
	                            y -= textRect.height - textRect.lineHeight / 2;
	                            break;
	                        default:
	                            y += textRect.lineHeight / 2;
	                    }
	                    // Force bseline to be middle
	                    baseline = 'middle';
	                }
	            }
	            else {				
	                var res = textContain.adjustTextPositionOnRect(
	                    textPosition, rect, textRect, distance
	                );
					
	                x = res.x;
	                y = res.y;
	                // Default align and baseline when has textPosition
	                align = align || res.textAlign;
	                baseline = baseline || res.textBaseline;
	            }			
			
	            // Use canvas default left textAlign. Giving invalid value will cause state not change
	            ctx.textAlign = align || 'left';
	            // Use canvas default alphabetic baseline
	            ctx.textBaseline = baseline || 'alphabetic';
	
	            var textFill = style.textFill;
	            var textStroke = style.textStroke;
	            textFill && (ctx.setFillStyle(textFill));
	            textStroke && (ctx.setStrokeStyle(textStroke));
	
				
	            // TODO Invalid font
				var fontSize = parseInt(
					(font || '18 simsun').split(' ')[0].replace('px', ''));
	            ctx.setFontSize(fontSize);
	
	            // Text shadow
	            // Always set shadowBlur and shadowOffset to avoid leak from displayable
				
				/*** we ***/
				ctx.setShadow(style.textShadowOffsetX, style.textShadowOffsetY, style.textShadowBlur, style.textShadowColor || 'rgba(0, 0, 0, 1)');
	            /*** we ***/
	
	            var textLines = text.split('\n');
	
	            if (style.textRotation) {
	                transform && ctx.translate(transform[4], transform[5]);
	                ctx.rotate(style.textRotation);
	                transform && ctx.translate(-transform[4], -transform[5]);
	            }	
				
		
	            for (var i = 0; i < textLines.length; i++) {
	                textFill && ctx.fillText(textLines[i], x, y);
	                textStroke && ctx.strokeText(textLines[i], x, y);
	                y += textRect.lineHeight;
	            }
	
	            ctx.restore();
	        }
	    };
	
	    module.exports = RectText;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var textWidthCache = {};
	    var textWidthCacheCounter = 0;
	    var TEXT_CACHE_MAX = 5000;
	
	    var util = __webpack_require__(5);
	    var BoundingRect = __webpack_require__(18);
	    var retrieve = util.retrieve;
	
	    function getTextWidth(text, textFont) {
	        var key = text + ':' + textFont;
	        if (textWidthCache[key]) {
	            return textWidthCache[key];
	        }
	
	        var textLines = (text + '').split('\n');
	        var width = 0;
			var fontSize = parseInt(
				(textFont || '18 simsun').split(' ')[0].replace('px', ''));
	
	        for (var i = 0, l = textLines.length; i < l; i++) {
	            // measureText 可以被覆盖以兼容不支持 Canvas 的环境
	            width = Math.max(textContain.measureText(textLines[i], fontSize).width, width);
	        }
	
	        if (textWidthCacheCounter > TEXT_CACHE_MAX) {
	            textWidthCacheCounter = 0;
	            textWidthCache = {};
	        }
	        textWidthCacheCounter++;
	        textWidthCache[key] = width;
	
	        return width;
	    }
	
	    function getTextRect(text, textFont, textAlign, textBaseline) {
	        var textLineLen = ((text || '') + '').split('\n').length;
	
	        var width = getTextWidth(text, textFont);
	        // FIXME 高度计算比较粗暴
	        var lineHeight = getTextWidth('国', textFont);
	        var height = textLineLen * lineHeight;
	
	        var rect = new BoundingRect(0, 0, width, height);
	        // Text has a special line height property
	        rect.lineHeight = lineHeight;
	
	        switch (textBaseline) {
	            case 'bottom':
	            case 'alphabetic':
	                rect.y -= lineHeight;
	                break;
	            case 'middle':
	                rect.y -= lineHeight / 2;
	                break;
	            // case 'hanging':
	            // case 'top':
	        }
	
	        // FIXME Right to left language
	        switch (textAlign) {
	            case 'end':
	            case 'right':
	                rect.x -= rect.width;
	                break;
	            case 'center':
	                rect.x -= rect.width / 2;
	                break;
	            // case 'start':
	            // case 'left':
	        }
	
	        return rect;
	    }
	
	    function adjustTextPositionOnRect(textPosition, rect, textRect, distance) {
	
	        var x = rect.x;
	        var y = rect.y;
	
	        var height = rect.height;
	        var width = rect.width;
	
	        var textHeight = textRect.height;
	
	        var halfHeight = height / 2 - textHeight / 2;
	
	        var textAlign = 'left';
	
	        switch (textPosition) {
	            case 'left':
	                x -= distance;
	                y += halfHeight;
	                textAlign = 'right';
	                break;
	            case 'right':
	                x += distance + width;
	                y += halfHeight;
	                textAlign = 'left';
	                break;
	            case 'top':
	                x += width / 2;
	                y -= distance + textHeight;
	                textAlign = 'center';
	                break;
	            case 'bottom':
	                x += width / 2;
	                y += height + distance;
	                textAlign = 'center';
	                break;
	            case 'inside':
	                x += width / 2;
	                y += halfHeight;
	                textAlign = 'center';
	                break;
	            case 'insideLeft':
	                x += distance;
	                y += halfHeight;
	                textAlign = 'left';
	                break;
	            case 'insideRight':
	                x += width - distance;
	                y += halfHeight;
	                textAlign = 'right';
	                break;
	            case 'insideTop':
	                x += width / 2;
	                y += distance;
	                textAlign = 'center';
	                break;
	            case 'insideBottom':
	                x += width / 2;
	                y += height - textHeight - distance;
	                textAlign = 'center';
	                break;
	            case 'insideTopLeft':
	                x += distance;
	                y += distance;
	                textAlign = 'left';
	                break;
	            case 'insideTopRight':
	                x += width - distance;
	                y += distance;
	                textAlign = 'right';
	                break;
	            case 'insideBottomLeft':
	                x += distance;
	                y += height - textHeight - distance;
	                break;
	            case 'insideBottomRight':
	                x += width - distance;
	                y += height - textHeight - distance;
	                textAlign = 'right';
	                break;
	        }
	
	        return {
	            x: x,
	            y: y,
	            textAlign: textAlign,
	            textBaseline: 'top'
	        };
	    }
	
	    /**
	     * Show ellipsis if overflow.
	     *
	     * @param  {string} text
	     * @param  {string} containerWidth
	     * @param  {string} textFont
	     * @param  {number} [ellipsis='...']
	     * @param  {Object} [options]
	     * @param  {number} [options.maxIterations=3]
	     * @param  {number} [options.minChar=0] If truncate result are less
	     *                  then minChar, ellipsis will not show, which is
	     *                  better for user hint in some cases.
	     * @param  {number} [options.placeholder=''] When all truncated, use the placeholder.
	     * @return {string}
	     */
	    function truncateText(text, containerWidth, textFont, ellipsis, options) {
	        if (!containerWidth) {
	            return '';
	        }
	
	        options = options || {};
	
	        ellipsis = retrieve(ellipsis, '...');
	        var maxIterations = retrieve(options.maxIterations, 2);
	        var minChar = retrieve(options.minChar, 0);
	        // FIXME
	        // Other languages?
	        var cnCharWidth = getTextWidth('国', textFont);
	        // FIXME
	        // Consider proportional font?
	        var ascCharWidth = getTextWidth('a', textFont);
	        var placeholder = retrieve(options.placeholder, '');
	
	        // Example 1: minChar: 3, text: 'asdfzxcv', truncate result: 'asdf', but not: 'a...'.
	        // Example 2: minChar: 3, text: '维度', truncate result: '维', but not: '...'.
	        var contentWidth = containerWidth = Math.max(0, containerWidth - 1); // Reserve some gap.
	        for (var i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
	            contentWidth -= ascCharWidth;
	        }
	
	        var ellipsisWidth = getTextWidth(ellipsis);
	        if (ellipsisWidth > contentWidth) {
	            ellipsis = '';
	            ellipsisWidth = 0;
	        }
	
	        contentWidth = containerWidth - ellipsisWidth;
	
	        var textLines = (text + '').split('\n');
	
	        for (var i = 0, len = textLines.length; i < len; i++) {
	            var textLine = textLines[i];
	            var lineWidth = getTextWidth(textLine, textFont);
	
	            if (lineWidth <= containerWidth) {
	                continue;
	            }
	
	            for (var j = 0;; j++) {
	                if (lineWidth <= contentWidth || j >= maxIterations) {
	                    textLine += ellipsis;
	                    break;
	                }
	
	                var subLength = j === 0
	                    ? estimateLength(textLine, contentWidth, ascCharWidth, cnCharWidth)
	                    : lineWidth > 0
	                    ? Math.floor(textLine.length * contentWidth / lineWidth)
	                    : 0;
	
	                textLine = textLine.substr(0, subLength);
	                lineWidth = getTextWidth(textLine, textFont);
	            }
	
	            if (textLine === '') {
	                textLine = placeholder;
	            }
	
	            textLines[i] = textLine;
	        }
	
	        return textLines.join('\n');
	    }
	
	    function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
	        var width = 0;
	        var i = 0;
	        for (var len = text.length; i < len && width < contentWidth; i++) {
	            var charCode = text.charCodeAt(i);
	            width += (0 <= charCode && charCode <= 127) ? ascCharWidth : cnCharWidth;
	        }
	        return i;
	    }
	
	    var textContain = {
	
	        getWidth: getTextWidth,
	
	        getBoundingRect: getTextRect,
	
	        adjustTextPositionOnRect: adjustTextPositionOnRect,
	
	        truncateText: truncateText,
	
	        measureText: function (text, fontSize) {
	           /*** we ***/
			   // MeasureText always return a fixed value   
			   return { width: 18}
			   /*** we ***/
	        }
	    };
	
	    module.exports = textContain;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Path 代理，可以在`buildPath`中用于替代`ctx`, 会保存每个path操作的命令到pathCommands属性中
	 * 可以用于 isInsidePath 判断以及获取boundingRect
	 *
	 * @module zrender/core/PathProxy
	 * @author Yi Shen (http://www.github.com/pissang)
	 */
	
	 // TODO getTotalLength, getPointAtLength
	
	
	    var curve = __webpack_require__(3);
	    var vec2 = __webpack_require__(2);
	    var bbox = __webpack_require__(1);
	    var BoundingRect = __webpack_require__(18);
	    var dpr = __webpack_require__(17).devicePixelRatio;
	
	    var CMD = {
	        M: 1,
	        L: 2,
	        C: 3,
	        Q: 4,
	        A: 5,
	        Z: 6,
	        // Rect
	        R: 7
	    };
	
	    var min = [];
	    var max = [];
	    var min2 = [];
	    var max2 = [];
	    var mathMin = Math.min;
	    var mathMax = Math.max;
	    var mathCos = Math.cos;
	    var mathSin = Math.sin;
	    var mathSqrt = Math.sqrt;
	    var mathAbs = Math.abs;
	
	    var hasTypedArray = typeof Float32Array != 'undefined';
	
	    /**
	     * @alias module:zrender/core/PathProxy
	     * @constructor
	     */
	    var PathProxy = function () {
	
	        /**
	         * Path data. Stored as flat array
	         * @type {Array.<Object>}
	         */
	        this.data = [];
	
	        this._len = 0;
	
	        this._ctx = null;
	
	        this._xi = 0;
	        this._yi = 0;
	
	        this._x0 = 0;
	        this._y0 = 0;
	
	        // Unit x, Unit y. Provide for avoiding drawing that too short line segment
	        this._ux = 0;
	        this._uy = 0;
	    };
	
	    /**
	     * 快速计算Path包围盒（并不是最小包围盒）
	     * @return {Object}
	     */
	    PathProxy.prototype = {
	
	        constructor: PathProxy,
	
	        _lineDash: null,
	
	        _dashOffset: 0,
	
	        _dashIdx: 0,
	
	        _dashSum: 0,
	
	        /**
	         * @readOnly
	         */
	        setScale: function (sx, sy) {
	            this._ux = mathAbs(1 / dpr / sx) || 0;
	            this._uy = mathAbs(1 / dpr / sy) || 0;
	        },
	
	        getContext: function () {
	            return this._ctx;
	        },
	
	        /**
	         * @param  {CanvasRenderingContext2D} ctx
	         * @return {module:zrender/core/PathProxy}
	         */
	        beginPath: function (ctx) {
	
	            this._ctx = ctx;
	
	            ctx && ctx.beginPath();
	
	            ctx && (this.dpr = ctx.dpr);
	
	            // Reset
	            this._len = 0;
	
	            if (this._lineDash) {
	                this._lineDash = null;
	
	                this._dashOffset = 0;
	            }
	
	            return this;
	        },
	
	        /**
	         * @param  {number} x
	         * @param  {number} y
	         * @return {module:zrender/core/PathProxy}
	         */
	        moveTo: function (x, y) {
	            this.addData(CMD.M, x, y);
	            this._ctx && this._ctx.moveTo(x, y);
	
	            // x0, y0, xi, yi 是记录在 _dashedXXXXTo 方法中使用
	            // xi, yi 记录当前点, x0, y0 在 closePath 的时候回到起始点。
	            // 有可能在 beginPath 之后直接调用 lineTo，这时候 x0, y0 需要
	            // 在 lineTo 方法中记录，这里先不考虑这种情况，dashed line 也只在 IE10- 中不支持
	            this._x0 = x;
	            this._y0 = y;
	
	            this._xi = x;
	            this._yi = y;
	
	            return this;
	        },
	
	        /**
	         * @param  {number} x
	         * @param  {number} y
	         * @return {module:zrender/core/PathProxy}
	         */
	        lineTo: function (x, y) {
	            var exceedUnit = mathAbs(x - this._xi) > this._ux
	                || mathAbs(y - this._yi) > this._uy
	                // Force draw the first segment
	                || this._len < 5;
	
	            this.addData(CMD.L, x, y);
	
	            if (this._ctx && exceedUnit) {
	                this._needsDash() ? this._dashedLineTo(x, y)
	                    : this._ctx.lineTo(x, y);
	            }
	            if (exceedUnit) {
	                this._xi = x;
	                this._yi = y;
	            }
	
	            return this;
	        },
	
	        /**
	         * @param  {number} x1
	         * @param  {number} y1
	         * @param  {number} x2
	         * @param  {number} y2
	         * @param  {number} x3
	         * @param  {number} y3
	         * @return {module:zrender/core/PathProxy}
	         */
	        bezierCurveTo: function (x1, y1, x2, y2, x3, y3) {
	            this.addData(CMD.C, x1, y1, x2, y2, x3, y3);
	            if (this._ctx) {
	                this._needsDash() ? this._dashedBezierTo(x1, y1, x2, y2, x3, y3)
	                    : this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
	            }
	            this._xi = x3;
	            this._yi = y3;
	            return this;
	        },
	
	        /**
	         * @param  {number} x1
	         * @param  {number} y1
	         * @param  {number} x2
	         * @param  {number} y2
	         * @return {module:zrender/core/PathProxy}
	         */
	        quadraticCurveTo: function (x1, y1, x2, y2) {
	            this.addData(CMD.Q, x1, y1, x2, y2);
	            if (this._ctx) {
	                this._needsDash() ? this._dashedQuadraticTo(x1, y1, x2, y2)
	                    : this._ctx.quadraticCurveTo(x1, y1, x2, y2);
	            }
	            this._xi = x2;
	            this._yi = y2;
	            return this;
	        },
	
	        /**
	         * @param  {number} cx
	         * @param  {number} cy
	         * @param  {number} r
	         * @param  {number} startAngle
	         * @param  {number} endAngle
	         * @param  {boolean} anticlockwise
	         * @return {module:zrender/core/PathProxy}
	         */
	        arc: function (cx, cy, r, startAngle, endAngle, anticlockwise) {
	            this.addData(
	                CMD.A, cx, cy, r, r, startAngle, endAngle - startAngle, 0, anticlockwise ? 0 : 1
	            );
	            this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
	
	            this._xi = mathCos(endAngle) * r + cx;
	            this._xi = mathSin(endAngle) * r + cx;
	            return this;
	        },
	
	        // TODO
	        arcTo: function (x1, y1, x2, y2, radius) {
	            if (this._ctx) {
	                this._ctx.arcTo(x1, y1, x2, y2, radius);
	            }
	            return this;
	        },
	
	        // TODO
	        rect: function (x, y, w, h) {
	            this._ctx && this._ctx.rect(x, y, w, h);
	            this.addData(CMD.R, x, y, w, h);
	            return this;
	        },
	
	        /**
	         * @return {module:zrender/core/PathProxy}
	         */
	        closePath: function () {
	            this.addData(CMD.Z);
	
	            var ctx = this._ctx;
	            var x0 = this._x0;
	            var y0 = this._y0;
	            if (ctx) {
	                this._needsDash() && this._dashedLineTo(x0, y0);
	                ctx.closePath();
	            }
	
	            this._xi = x0;
	            this._yi = y0;
	            return this;
	        },
	
	        /**
	         * Context 从外部传入，因为有可能是 rebuildPath 完之后再 fill。
	         * stroke 同样
	         * @param {CanvasRenderingContext2D} ctx
	         * @return {module:zrender/core/PathProxy}
	         */
	        fill: function (ctx) {
	            ctx && ctx.fill();
	            this.toStatic();
	        },
	
	        /**
	         * @param {CanvasRenderingContext2D} ctx
	         * @return {module:zrender/core/PathProxy}
	         */
	        stroke: function (ctx) {
	            ctx && ctx.stroke();
	            this.toStatic();
	        },
	
	        /**
	         * 必须在其它绘制命令前调用
	         * Must be invoked before all other path drawing methods
	         * @return {module:zrender/core/PathProxy}
	         */
	        setLineDash: function (lineDash) {
	            if (lineDash instanceof Array) {
	                this._lineDash = lineDash;
	
	                this._dashIdx = 0;
	
	                var lineDashSum = 0;
	                for (var i = 0; i < lineDash.length; i++) {
	                    lineDashSum += lineDash[i];
	                }
	                this._dashSum = lineDashSum;
	            }
	            return this;
	        },
	
	        /**
	         * 必须在其它绘制命令前调用
	         * Must be invoked before all other path drawing methods
	         * @return {module:zrender/core/PathProxy}
	         */
	        setLineDashOffset: function (offset) {
	            this._dashOffset = offset;
	            return this;
	        },
	
	        /**
	         *
	         * @return {boolean}
	         */
	        len: function () {
	            return this._len;
	        },
	
	        /**
	         * 直接设置 Path 数据
	         */
	        setData: function (data) {
	
	            var len = data.length;
	
	            if (! (this.data && this.data.length == len) && hasTypedArray) {
	                this.data = new Float32Array(len);
	            }
	
	            for (var i = 0; i < len; i++) {
	                this.data[i] = data[i];
	            }
	
	            this._len = len;
	        },
	
	        /**
	         * 添加子路径
	         * @param {module:zrender/core/PathProxy|Array.<module:zrender/core/PathProxy>} path
	         */
	        appendPath: function (path) {
	            if (!(path instanceof Array)) {
	                path = [path];
	            }
	            var len = path.length;
	            var appendSize = 0;
	            var offset = this._len;
	            for (var i = 0; i < len; i++) {
	                appendSize += path[i].len();
	            }
	            if (hasTypedArray && (this.data instanceof Float32Array)) {
	                this.data = new Float32Array(offset + appendSize);
	            }
	            for (var i = 0; i < len; i++) {
	                var appendPathData = path[i].data;
	                for (var k = 0; k < appendPathData.length; k++) {
	                    this.data[offset++] = appendPathData[k];
	                }
	            }
	            this._len = offset;
	        },
	
	        /**
	         * 填充 Path 数据。
	         * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
	         */
	        addData: function (cmd) {
	            var data = this.data;
	            if (this._len + arguments.length > data.length) {
	                // 因为之前的数组已经转换成静态的 Float32Array
	                // 所以不够用时需要扩展一个新的动态数组
	                this._expandData();
	                data = this.data;
	            }
	            for (var i = 0; i < arguments.length; i++) {
	                data[this._len++] = arguments[i];
	            }
	
	            this._prevCmd = cmd;
	        },
	
	        _expandData: function () {
	            // Only if data is Float32Array
	            if (!(this.data instanceof Array)) {
	                var newData = [];
	                for (var i = 0; i < this._len; i++) {
	                    newData[i] = this.data[i];
	                }
	                this.data = newData;
	            }
	        },
	
	        /**
	         * If needs js implemented dashed line
	         * @return {boolean}
	         * @private
	         */
	        _needsDash: function () {
	            return this._lineDash;
	        },
	
	        _dashedLineTo: function (x1, y1) {
	            var dashSum = this._dashSum;
	            var offset = this._dashOffset;
	            var lineDash = this._lineDash;
	            var ctx = this._ctx;
	
	            var x0 = this._xi;
	            var y0 = this._yi;
	            var dx = x1 - x0;
	            var dy = y1 - y0;
	            var dist = mathSqrt(dx * dx + dy * dy);
	            var x = x0;
	            var y = y0;
	            var dash;
	            var nDash = lineDash.length;
	            var idx;
	            dx /= dist;
	            dy /= dist;
	
	            if (offset < 0) {
	                // Convert to positive offset
	                offset = dashSum + offset;
	            }
	            offset %= dashSum;
	            x -= offset * dx;
	            y -= offset * dy;
	
	            while ((dx > 0 && x <= x1) || (dx < 0 && x >= x1)
	            || (dx == 0 && ((dy > 0 && y <= y1) || (dy < 0 && y >= y1)))) {
	                idx = this._dashIdx;
	                dash = lineDash[idx];
	                x += dx * dash;
	                y += dy * dash;
	                this._dashIdx = (idx + 1) % nDash;
	                // Skip positive offset
	                if ((dx > 0 && x < x0) || (dx < 0 && x > x0) || (dy > 0 && y < y0) || (dy < 0 && y > y0)) {
	                    continue;
	                }
	                ctx[idx % 2 ? 'moveTo' : 'lineTo'](
	                    dx >= 0 ? mathMin(x, x1) : mathMax(x, x1),
	                    dy >= 0 ? mathMin(y, y1) : mathMax(y, y1)
	                );
	            }
	            // Offset for next lineTo
	            dx = x - x1;
	            dy = y - y1;
	            this._dashOffset = -mathSqrt(dx * dx + dy * dy);
	        },
	
	        // Not accurate dashed line to
	        _dashedBezierTo: function (x1, y1, x2, y2, x3, y3) {
	            var dashSum = this._dashSum;
	            var offset = this._dashOffset;
	            var lineDash = this._lineDash;
	            var ctx = this._ctx;
	
	            var x0 = this._xi;
	            var y0 = this._yi;
	            var t;
	            var dx;
	            var dy;
	            var cubicAt = curve.cubicAt;
	            var bezierLen = 0;
	            var idx = this._dashIdx;
	            var nDash = lineDash.length;
	
	            var x;
	            var y;
	
	            var tmpLen = 0;
	
	            if (offset < 0) {
	                // Convert to positive offset
	                offset = dashSum + offset;
	            }
	            offset %= dashSum;
	            // Bezier approx length
	            for (t = 0; t < 1; t += 0.1) {
	                dx = cubicAt(x0, x1, x2, x3, t + 0.1)
	                    - cubicAt(x0, x1, x2, x3, t);
	                dy = cubicAt(y0, y1, y2, y3, t + 0.1)
	                    - cubicAt(y0, y1, y2, y3, t);
	                bezierLen += mathSqrt(dx * dx + dy * dy);
	            }
	
	            // Find idx after add offset
	            for (; idx < nDash; idx++) {
	                tmpLen += lineDash[idx];
	                if (tmpLen > offset) {
	                    break;
	                }
	            }
	            t = (tmpLen - offset) / bezierLen;
	
	            while (t <= 1) {
	
	                x = cubicAt(x0, x1, x2, x3, t);
	                y = cubicAt(y0, y1, y2, y3, t);
	
	                // Use line to approximate dashed bezier
	                // Bad result if dash is long
	                idx % 2 ? ctx.moveTo(x, y)
	                    : ctx.lineTo(x, y);
	
	                t += lineDash[idx] / bezierLen;
	
	                idx = (idx + 1) % nDash;
	            }
	
	            // Finish the last segment and calculate the new offset
	            (idx % 2 !== 0) && ctx.lineTo(x3, y3);
	            dx = x3 - x;
	            dy = y3 - y;
	            this._dashOffset = -mathSqrt(dx * dx + dy * dy);
	        },
	
	        _dashedQuadraticTo: function (x1, y1, x2, y2) {
	            // Convert quadratic to cubic using degree elevation
	            var x3 = x2;
	            var y3 = y2;
	            x2 = (x2 + 2 * x1) / 3;
	            y2 = (y2 + 2 * y1) / 3;
	            x1 = (this._xi + 2 * x1) / 3;
	            y1 = (this._yi + 2 * y1) / 3;
	
	            this._dashedBezierTo(x1, y1, x2, y2, x3, y3);
	        },
	
	        /**
	         * 转成静态的 Float32Array 减少堆内存占用
	         * Convert dynamic array to static Float32Array
	         */
	        toStatic: function () {
	            var data = this.data;
	            if (data instanceof Array) {
	                data.length = this._len;
	                if (hasTypedArray) {
	                    this.data = new Float32Array(data);
	                }
	            }
	        },
	
	        /**
	         * @return {module:zrender/core/BoundingRect}
	         */
	        getBoundingRect: function () {
	            min[0] = min[1] = min2[0] = min2[1] = Number.MAX_VALUE;
	            max[0] = max[1] = max2[0] = max2[1] = -Number.MAX_VALUE;
	
	            var data = this.data;
	            var xi = 0;
	            var yi = 0;
	            var x0 = 0;
	            var y0 = 0;
	
	            for (var i = 0; i < data.length;) {
	                var cmd = data[i++];
	
	                if (i == 1) {
	                    // 如果第一个命令是 L, C, Q
	                    // 则 previous point 同绘制命令的第一个 point
	                    //
	                    // 第一个命令为 Arc 的情况下会在后面特殊处理
	                    xi = data[i];
	                    yi = data[i + 1];
	
	                    x0 = xi;
	                    y0 = yi;
	                }
	
	                switch (cmd) {
	                    case CMD.M:
	                        // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
	                        // 在 closePath 的时候使用
	                        x0 = data[i++];
	                        y0 = data[i++];
	                        xi = x0;
	                        yi = y0;
	                        min2[0] = x0;
	                        min2[1] = y0;
	                        max2[0] = x0;
	                        max2[1] = y0;
	                        break;
	                    case CMD.L:
	                        bbox.fromLine(xi, yi, data[i], data[i + 1], min2, max2);
	                        xi = data[i++];
	                        yi = data[i++];
	                        break;
	                    case CMD.C:
	                        bbox.fromCubic(
	                            xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
	                            min2, max2
	                        );
	                        xi = data[i++];
	                        yi = data[i++];
	                        break;
	                    case CMD.Q:
	                        bbox.fromQuadratic(
	                            xi, yi, data[i++], data[i++], data[i], data[i + 1],
	                            min2, max2
	                        );
	                        xi = data[i++];
	                        yi = data[i++];
	                        break;
	                    case CMD.A:
	                        // TODO Arc 判断的开销比较大
	                        var cx = data[i++];
	                        var cy = data[i++];
	                        var rx = data[i++];
	                        var ry = data[i++];
	                        var startAngle = data[i++];
	                        var endAngle = data[i++] + startAngle;
	                        // TODO Arc 旋转
	                        var psi = data[i++];
	                        var anticlockwise = 1 - data[i++];
	
	                        if (i == 1) {
	                            // 直接使用 arc 命令
	                            // 第一个命令起点还未定义
	                            x0 = mathCos(startAngle) * rx + cx;
	                            y0 = mathSin(startAngle) * ry + cy;
	                        }
	
	                        bbox.fromArc(
	                            cx, cy, rx, ry, startAngle, endAngle,
	                            anticlockwise, min2, max2
	                        );
	
	                        xi = mathCos(endAngle) * rx + cx;
	                        yi = mathSin(endAngle) * ry + cy;
	                        break;
	                    case CMD.R:
	                        x0 = xi = data[i++];
	                        y0 = yi = data[i++];
	                        var width = data[i++];
	                        var height = data[i++];
	                        // Use fromLine
	                        bbox.fromLine(x0, y0, x0 + width, y0 + height, min2, max2);
	                        break;
	                    case CMD.Z:
	                        xi = x0;
	                        yi = y0;
	                        break;
	                }
	
	                // Union
	                vec2.min(min, min, min2);
	                vec2.max(max, max, max2);
	            }
	
	            // No data
	            if (i === 0) {
	                min[0] = min[1] = max[0] = max[1] = 0;
	            }
	
	            return new BoundingRect(
	                min[0], min[1], max[0] - min[0], max[1] - min[1]
	            );
	        },
	
	        /**
	         * Rebuild path from current data
	         * Rebuild path will not consider javascript implemented line dash.
	         * @param {CanvasRenderingContext} ctx
	         */
	        rebuildPath: function (ctx) {
	            var d = this.data;
	            var x0, y0;
	            var xi, yi;
	            var x, y;
	            var ux = this._ux;
	            var uy = this._uy;
	            var len = this._len;
	            for (var i = 0; i < len;) {
	                var cmd = d[i++];
	
	                if (i == 1) {
	                    // 如果第一个命令是 L, C, Q
	                    // 则 previous point 同绘制命令的第一个 point
	                    //
	                    // 第一个命令为 Arc 的情况下会在后面特殊处理
	                    xi = d[i];
	                    yi = d[i + 1];
	
	                    x0 = xi;
	                    y0 = yi;
	                }
	                switch (cmd) {
	                    case CMD.M:
	                        x0 = xi = d[i++];
	                        y0 = yi = d[i++];
	                        ctx.moveTo(xi, yi);
	                        break;
	                    case CMD.L:
	                        x = d[i++];
	                        y = d[i++];
	                        // Not draw too small seg between
	                        if (mathAbs(x - xi) > ux || mathAbs(y - yi) > uy || i === len - 1) {
	                            ctx.lineTo(x, y);
	                            xi = x;
	                            yi = y;
	                        }
	                        break;
	                    case CMD.C:
	                        ctx.bezierCurveTo(
	                            d[i++], d[i++], d[i++], d[i++], d[i++], d[i++]
	                        );
	                        xi = d[i - 2];
	                        yi = d[i - 1];
	                        break;
	                    case CMD.Q:
	                        ctx.quadraticCurveTo(d[i++], d[i++], d[i++], d[i++]);
	                        xi = d[i - 2];
	                        yi = d[i - 1];
	                        break;
	                    case CMD.A:
	                        var cx = d[i++];
	                        var cy = d[i++];
	                        var rx = d[i++];
	                        var ry = d[i++];
	                        var theta = d[i++];
	                        var dTheta = d[i++];
	                        var psi = d[i++];
	                        var fs = d[i++];
	                        var r = (rx > ry) ? rx : ry;
	                        var scaleX = (rx > ry) ? 1 : rx / ry;
	                        var scaleY = (rx > ry) ? ry / rx : 1;
	                        var isEllipse = Math.abs(rx - ry) > 1e-3;
	                        var endAngle = theta + dTheta;
	                        if (isEllipse) {
	                            ctx.translate(cx, cy);
	                            ctx.rotate(psi);
	                            ctx.scale(scaleX, scaleY);
	                            ctx.arc(0, 0, r, theta, endAngle, 1 - fs);
	                            ctx.scale(1 / scaleX, 1 / scaleY);
	                            ctx.rotate(-psi);
	                            ctx.translate(-cx, -cy);
	                        }
	                        else {
	                            ctx.arc(cx, cy, r, theta, endAngle, 1 - fs);
	                        }
	
	                        if (i == 1) {
	                            // 直接使用 arc 命令
	                            // 第一个命令起点还未定义
	                            x0 = mathCos(theta) * rx + cx;
	                            y0 = mathSin(theta) * ry + cy;
	                        }
	                        xi = mathCos(endAngle) * rx + cx;
	                        yi = mathSin(endAngle) * ry + cy;
	                        break;
	                    case CMD.R:
	                        x0 = xi = d[i];
	                        y0 = yi = d[i + 1];
	                        ctx.rect(d[i++], d[i++], d[i++], d[i++]);
	                        break;
	                    case CMD.Z:
	                        ctx.closePath();
	                        xi = x0;
	                        yi = y0;
	                }
	            }
	        }
	    };
	
	    PathProxy.CMD = CMD;
	
	    module.exports = PathProxy;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	    var CMD = __webpack_require__(25).CMD;
	    var line = __webpack_require__(27);
	    var cubic = __webpack_require__(28);
	    var quadratic = __webpack_require__(29);
	    var arc = __webpack_require__(30);
	    var normalizeRadian = __webpack_require__(31).normalizeRadian;
	    var curve = __webpack_require__(3);
	
	    var windingLine = __webpack_require__(32);
	
	    var containStroke = line.containStroke;
	
	    var PI2 = Math.PI * 2;
	
	    var EPSILON = 1e-4;
	
	    function isAroundEqual(a, b) {
	        return Math.abs(a - b) < EPSILON;
	    }
	
	    // 临时数组
	    var roots = [-1, -1, -1];
	    var extrema = [-1, -1];
	
	    function swapExtrema() {
	        var tmp = extrema[0];
	        extrema[0] = extrema[1];
	        extrema[1] = tmp;
	    }
	
	    function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
	        // Quick reject
	        if (
	            (y > y0 && y > y1 && y > y2 && y > y3)
	            || (y < y0 && y < y1 && y < y2 && y < y3)
	        ) {
	            return 0;
	        }
	        var nRoots = curve.cubicRootAt(y0, y1, y2, y3, y, roots);
	        if (nRoots === 0) {
	            return 0;
	        }
	        else {
	            var w = 0;
	            var nExtrema = -1;
	            var y0_, y1_;
	            for (var i = 0; i < nRoots; i++) {
	                var t = roots[i];
	
	                // Avoid winding error when intersection point is the connect point of two line of polygon
	                var unit = (t === 0 || t === 1) ? 0.5 : 1;
	
	                var x_ = curve.cubicAt(x0, x1, x2, x3, t);
	                if (x_ < x) { // Quick reject
	                    continue;
	                }
	                if (nExtrema < 0) {
	                    nExtrema = curve.cubicExtrema(y0, y1, y2, y3, extrema);
	                    if (extrema[1] < extrema[0] && nExtrema > 1) {
	                        swapExtrema();
	                    }
	                    y0_ = curve.cubicAt(y0, y1, y2, y3, extrema[0]);
	                    if (nExtrema > 1) {
	                        y1_ = curve.cubicAt(y0, y1, y2, y3, extrema[1]);
	                    }
	                }
	                if (nExtrema == 2) {
	                    // 分成三段单调函数
	                    if (t < extrema[0]) {
	                        w += y0_ < y0 ? unit : -unit;
	                    }
	                    else if (t < extrema[1]) {
	                        w += y1_ < y0_ ? unit : -unit;
	                    }
	                    else {
	                        w += y3 < y1_ ? unit : -unit;
	                    }
	                }
	                else {
	                    // 分成两段单调函数
	                    if (t < extrema[0]) {
	                        w += y0_ < y0 ? unit : -unit;
	                    }
	                    else {
	                        w += y3 < y0_ ? unit : -unit;
	                    }
	                }
	            }
	            return w;
	        }
	    }
	
	    function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
	        // Quick reject
	        if (
	            (y > y0 && y > y1 && y > y2)
	            || (y < y0 && y < y1 && y < y2)
	        ) {
	            return 0;
	        }
	        var nRoots = curve.quadraticRootAt(y0, y1, y2, y, roots);
	        if (nRoots === 0) {
	            return 0;
	        }
	        else {
	            var t = curve.quadraticExtremum(y0, y1, y2);
	            if (t >= 0 && t <= 1) {
	                var w = 0;
	                var y_ = curve.quadraticAt(y0, y1, y2, t);
	                for (var i = 0; i < nRoots; i++) {
	                    // Remove one endpoint.
	                    var unit = (roots[i] === 0 || roots[i] === 1) ? 0.5 : 1;
	
	                    var x_ = curve.quadraticAt(x0, x1, x2, roots[i]);
	                    if (x_ < x) {   // Quick reject
	                        continue;
	                    }
	                    if (roots[i] < t) {
	                        w += y_ < y0 ? unit : -unit;
	                    }
	                    else {
	                        w += y2 < y_ ? unit : -unit;
	                    }
	                }
	                return w;
	            }
	            else {
	                // Remove one endpoint.
	                var unit = (roots[0] === 0 || roots[0] === 1) ? 0.5 : 1;
	
	                var x_ = curve.quadraticAt(x0, x1, x2, roots[0]);
	                if (x_ < x) {   // Quick reject
	                    return 0;
	                }
	                return y2 < y0 ? unit : -unit;
	            }
	        }
	    }
	
	    // TODO
	    // Arc 旋转
	    function windingArc(
	        cx, cy, r, startAngle, endAngle, anticlockwise, x, y
	    ) {
	        y -= cy;
	        if (y > r || y < -r) {
	            return 0;
	        }
	        var tmp = Math.sqrt(r * r - y * y);
	        roots[0] = -tmp;
	        roots[1] = tmp;
	
	        var diff = Math.abs(startAngle - endAngle);
	        if (diff < 1e-4) {
	            return 0;
	        }
	        if (diff % PI2 < 1e-4) {
	            // Is a circle
	            startAngle = 0;
	            endAngle = PI2;
	            var dir = anticlockwise ? 1 : -1;
	            if (x >= roots[0] + cx && x <= roots[1] + cx) {
	                return dir;
	            } else {
	                return 0;
	            }
	        }
	
	        if (anticlockwise) {
	            var tmp = startAngle;
	            startAngle = normalizeRadian(endAngle);
	            endAngle = normalizeRadian(tmp);
	        }
	        else {
	            startAngle = normalizeRadian(startAngle);
	            endAngle = normalizeRadian(endAngle);
	        }
	        if (startAngle > endAngle) {
	            endAngle += PI2;
	        }
	
	        var w = 0;
	        for (var i = 0; i < 2; i++) {
	            var x_ = roots[i];
	            if (x_ + cx > x) {
	                var angle = Math.atan2(y, x_);
	                var dir = anticlockwise ? 1 : -1;
	                if (angle < 0) {
	                    angle = PI2 + angle;
	                }
	                if (
	                    (angle >= startAngle && angle <= endAngle)
	                    || (angle + PI2 >= startAngle && angle + PI2 <= endAngle)
	                ) {
	                    if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
	                        dir = -dir;
	                    }
	                    w += dir;
	                }
	            }
	        }
	        return w;
	    }
	
	    function containPath(data, lineWidth, isStroke, x, y) {
	        var w = 0;
	        var xi = 0;
	        var yi = 0;
	        var x0 = 0;
	        var y0 = 0;
	
	        for (var i = 0; i < data.length;) {
	            var cmd = data[i++];
	            // Begin a new subpath
	            if (cmd === CMD.M && i > 1) {
	                // Close previous subpath
	                if (!isStroke) {
	                    w += windingLine(xi, yi, x0, y0, x, y);
	                }
	                // 如果被任何一个 subpath 包含
	                // if (w !== 0) {
	                //     return true;
	                // }
	            }
	
	            if (i == 1) {
	                // 如果第一个命令是 L, C, Q
	                // 则 previous point 同绘制命令的第一个 point
	                //
	                // 第一个命令为 Arc 的情况下会在后面特殊处理
	                xi = data[i];
	                yi = data[i + 1];
	
	                x0 = xi;
	                y0 = yi;
	            }
	
	            switch (cmd) {
	                case CMD.M:
	                    // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
	                    // 在 closePath 的时候使用
	                    x0 = data[i++];
	                    y0 = data[i++];
	                    xi = x0;
	                    yi = y0;
	                    break;
	                case CMD.L:
	                    if (isStroke) {
	                        if (containStroke(xi, yi, data[i], data[i + 1], lineWidth, x, y)) {
	                            return true;
	                        }
	                    }
	                    else {
	                        // NOTE 在第一个命令为 L, C, Q 的时候会计算出 NaN
	                        w += windingLine(xi, yi, data[i], data[i + 1], x, y) || 0;
	                    }
	                    xi = data[i++];
	                    yi = data[i++];
	                    break;
	                case CMD.C:
	                    if (isStroke) {
	                        if (cubic.containStroke(xi, yi,
	                            data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
	                            lineWidth, x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                    else {
	                        w += windingCubic(
	                            xi, yi,
	                            data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
	                            x, y
	                        ) || 0;
	                    }
	                    xi = data[i++];
	                    yi = data[i++];
	                    break;
	                case CMD.Q:
	                    if (isStroke) {
	                        if (quadratic.containStroke(xi, yi,
	                            data[i++], data[i++], data[i], data[i + 1],
	                            lineWidth, x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                    else {
	                        w += windingQuadratic(
	                            xi, yi,
	                            data[i++], data[i++], data[i], data[i + 1],
	                            x, y
	                        ) || 0;
	                    }
	                    xi = data[i++];
	                    yi = data[i++];
	                    break;
	                case CMD.A:
	                    // TODO Arc 判断的开销比较大
	                    var cx = data[i++];
	                    var cy = data[i++];
	                    var rx = data[i++];
	                    var ry = data[i++];
	                    var theta = data[i++];
	                    var dTheta = data[i++];
	                    // TODO Arc 旋转
	                    var psi = data[i++];
	                    var anticlockwise = 1 - data[i++];
	                    var x1 = Math.cos(theta) * rx + cx;
	                    var y1 = Math.sin(theta) * ry + cy;
	                    // 不是直接使用 arc 命令
	                    if (i > 1) {
	                        w += windingLine(xi, yi, x1, y1, x, y);
	                    }
	                    else {
	                        // 第一个命令起点还未定义
	                        x0 = x1;
	                        y0 = y1;
	                    }
	                    // zr 使用scale来模拟椭圆, 这里也对x做一定的缩放
	                    var _x = (x - cx) * ry / rx + cx;
	                    if (isStroke) {
	                        if (arc.containStroke(
	                            cx, cy, ry, theta, theta + dTheta, anticlockwise,
	                            lineWidth, _x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                    else {
	                        w += windingArc(
	                            cx, cy, ry, theta, theta + dTheta, anticlockwise,
	                            _x, y
	                        );
	                    }
	                    xi = Math.cos(theta + dTheta) * rx + cx;
	                    yi = Math.sin(theta + dTheta) * ry + cy;
	                    break;
	                case CMD.R:
	                    x0 = xi = data[i++];
	                    y0 = yi = data[i++];
	                    var width = data[i++];
	                    var height = data[i++];
	                    var x1 = x0 + width;
	                    var y1 = y0 + height;
	                    if (isStroke) {
	                        if (containStroke(x0, y0, x1, y0, lineWidth, x, y)
	                          || containStroke(x1, y0, x1, y1, lineWidth, x, y)
	                          || containStroke(x1, y1, x0, y1, lineWidth, x, y)
	                          || containStroke(x0, y1, x0, y0, lineWidth, x, y)
	                        ) {
	                            return true;
	                        }
	                    }
	                    else {
	                        // FIXME Clockwise ?
	                        w += windingLine(x1, y0, x1, y1, x, y);
	                        w += windingLine(x0, y1, x0, y0, x, y);
	                    }
	                    break;
	                case CMD.Z:
	                    if (isStroke) {
	                        if (containStroke(
	                            xi, yi, x0, y0, lineWidth, x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                    else {
	                        // Close a subpath
	                        w += windingLine(xi, yi, x0, y0, x, y);
	                        // 如果被任何一个 subpath 包含
	                        // FIXME subpaths may overlap
	                        // if (w !== 0) {
	                        //     return true;
	                        // }
	                    }
	                    xi = x0;
	                    yi = y0;
	                    break;
	            }
	        }
	        if (!isStroke && !isAroundEqual(yi, y0)) {
	            w += windingLine(xi, yi, x0, y0, x, y) || 0;
	        }
	        return w !== 0;
	    }
	
	    module.exports = {
	        contain: function (pathData, x, y) {
	            return containPath(pathData, 0, false, x, y);
	        },
	
	        containStroke: function (pathData, lineWidth, x, y) {
	            return containPath(pathData, lineWidth, true, x, y);
	        }
	    };


/***/ },
/* 27 */
/***/ function(module, exports) {

	
	    module.exports = {
	        /**
	         * 线段包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        containStroke: function (x0, y0, x1, y1, lineWidth, x, y) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = lineWidth;
	            var _a = 0;
	            var _b = x0;
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l)
	                || (y < y0 - _l && y < y1 - _l)
	                || (x > x0 + _l && x > x1 + _l)
	                || (x < x0 - _l && x < x1 - _l)
	            ) {
	                return false;
	            }
	
	            if (x0 !== x1) {
	                _a = (y0 - y1) / (x0 - x1);
	                _b = (x0 * y1 - x1 * y0) / (x0 - x1) ;
	            }
	            else {
	                return Math.abs(x - x0) <= _l / 2;
	            }
	            var tmp = _a * x - y + _b;
	            var _s = tmp * tmp / (_a * _a + 1);
	            return _s <= _l / 2 * _l / 2;
	        }
	    };


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var curve = __webpack_require__(3);
	
	    module.exports = {
	        /**
	         * 三次贝塞尔曲线描边包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  x2
	         * @param  {number}  y2
	         * @param  {number}  x3
	         * @param  {number}  y3
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        containStroke: function(x0, y0, x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = lineWidth;
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l)
	                || (y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l)
	                || (x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l)
	                || (x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l)
	            ) {
	                return false;
	            }
	            var d = curve.cubicProjectPoint(
	                x0, y0, x1, y1, x2, y2, x3, y3,
	                x, y, null
	            );
	            return d <= _l / 2;
	        }
	    };


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var curve = __webpack_require__(3);
	
	    module.exports = {
	        /**
	         * 二次贝塞尔曲线描边包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  x2
	         * @param  {number}  y2
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        containStroke: function (x0, y0, x1, y1, x2, y2, lineWidth, x, y) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = lineWidth;
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l && y > y2 + _l)
	                || (y < y0 - _l && y < y1 - _l && y < y2 - _l)
	                || (x > x0 + _l && x > x1 + _l && x > x2 + _l)
	                || (x < x0 - _l && x < x1 - _l && x < x2 - _l)
	            ) {
	                return false;
	            }
	            var d = curve.quadraticProjectPoint(
	                x0, y0, x1, y1, x2, y2,
	                x, y, null
	            );
	            return d <= _l / 2;
	        }
	    };


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var normalizeRadian = __webpack_require__(31).normalizeRadian;
	    var PI2 = Math.PI * 2;
	
	    module.exports = {
	        /**
	         * 圆弧描边包含判断
	         * @param  {number}  cx
	         * @param  {number}  cy
	         * @param  {number}  r
	         * @param  {number}  startAngle
	         * @param  {number}  endAngle
	         * @param  {boolean}  anticlockwise
	         * @param  {number} lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {Boolean}
	         */
	        containStroke: function (
	            cx, cy, r, startAngle, endAngle, anticlockwise,
	            lineWidth, x, y
	        ) {
	
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = lineWidth;
	
	            x -= cx;
	            y -= cy;
	            var d = Math.sqrt(x * x + y * y);
	
	            if ((d - _l > r) || (d + _l < r)) {
	                return false;
	            }
	            if (Math.abs(startAngle - endAngle) % PI2 < 1e-4) {
	                // Is a circle
	                return true;
	            }
	            if (anticlockwise) {
	                var tmp = startAngle;
	                startAngle = normalizeRadian(endAngle);
	                endAngle = normalizeRadian(tmp);
	            } else {
	                startAngle = normalizeRadian(startAngle);
	                endAngle = normalizeRadian(endAngle);
	            }
	            if (startAngle > endAngle) {
	                endAngle += PI2;
	            }
	
	            var angle = Math.atan2(y, x);
	            if (angle < 0) {
	                angle += PI2;
	            }
	            return (angle >= startAngle && angle <= endAngle)
	                || (angle + PI2 >= startAngle && angle + PI2 <= endAngle);
	        }
	    };


/***/ },
/* 31 */
/***/ function(module, exports) {

	
	
	    var PI2 = Math.PI * 2;
	    module.exports = {
	        normalizeRadian: function(angle) {
	            angle %= PI2;
	            if (angle < 0) {
	                angle += PI2;
	            }
	            return angle;
	        }
	    };


/***/ },
/* 32 */
/***/ function(module, exports) {

	
	    module.exports = function windingLine(x0, y0, x1, y1, x, y) {
	        if ((y > y0 && y > y1) || (y < y0 && y < y1)) {
	            return 0;
	        }
	        // Ignore horizontal line
	        if (y1 === y0) {
	            return 0;
	        }
	        var dir = y1 < y0 ? 1 : -1;
	        var t = (y - y0) / (y1 - y0);
	
	        // Avoid winding error when intersection point is the connect point of two line of polygon
	        if (t === 1 || t === 0) {
	            dir = y1 < y0 ? 0.5 : -0.5;
	        }
	
	        var x_ = t * (x1 - x0) + x0;
	
	        return x_ > x ? dir : 0;
	    };


/***/ },
/* 33 */
/***/ function(module, exports) {

	
	
	    var Pattern = function (image, repeat) {
	        this.image = image;
	        this.repeat = repeat;
	
	        // Can be cloned
	        this.type = 'pattern';
	    };
	
	    Pattern.prototype.getCanvasPattern = function (ctx) {
	
	        return this._canvasPattern
	            || (this._canvasPattern = ctx.createPattern(this.image, this.repeat));
	    };
	
	    module.exports = Pattern;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 贝塞尔曲线
	 * @module zrender/shape/BezierCurve
	 */
	
	var curveTool = __webpack_require__(3);
	var vec2 = __webpack_require__(2);
	var quadraticSubdivide = curveTool.quadraticSubdivide;
	var cubicSubdivide = curveTool.cubicSubdivide;
	var quadraticAt = curveTool.quadraticAt;
	var cubicAt = curveTool.cubicAt;
	var quadraticDerivativeAt = curveTool.quadraticDerivativeAt;
	var cubicDerivativeAt = curveTool.cubicDerivativeAt;
	
	var out = [];
	
	function someVectorAt(shape, t, isTangent) {
	    var cpx2 = shape.cpx2;
	    var cpy2 = shape.cpy2;
	    if (cpx2 === null || cpy2 === null) {
	        return [
	            (isTangent ? cubicDerivativeAt : cubicAt)(shape.x1, shape.cpx1, shape.cpx2, shape.x2, t),
	            (isTangent ? cubicDerivativeAt : cubicAt)(shape.y1, shape.cpy1, shape.cpy2, shape.y2, t)
	        ];
	    }
	    else {
	        return [
	            (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.x1, shape.cpx1, shape.x2, t),
	            (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.y1, shape.cpy1, shape.y2, t)
	        ];
	    }
	}
	module.exports = __webpack_require__(20).extend({
	
	    type: 'bezier-curve',
	
	    shape: {
	        x1: 0,
	        y1: 0,
	        x2: 0,
	        y2: 0,
	        cpx1: 0,
	        cpy1: 0,
	        // cpx2: 0,
	        // cpy2: 0
	
	        // Curve show percent, for animating
	        percent: 1
	    },
	
	    style: {
	        stroke: '#000000',
	        fill: null
	    },
	
	    buildPath: function (ctx, shape) {
	        var x1 = shape.x1;
	        var y1 = shape.y1;
	        var x2 = shape.x2;
	        var y2 = shape.y2;
	        var cpx1 = shape.cpx1;
	        var cpy1 = shape.cpy1;
	        var cpx2 = shape.cpx2;
	        var cpy2 = shape.cpy2;
	        var percent = shape.percent;
	        if (percent === 0) {
	            return;
	        }
	
	        ctx.moveTo(x1, y1);
	
	        if (cpx2 == null || cpy2 == null) {
	            if (percent < 1) {
	                quadraticSubdivide(
	                    x1, cpx1, x2, percent, out
	                );
	                cpx1 = out[1];
	                x2 = out[2];
	                quadraticSubdivide(
	                    y1, cpy1, y2, percent, out
	                );
	                cpy1 = out[1];
	                y2 = out[2];
	            }
	
	            ctx.quadraticCurveTo(
	                cpx1, cpy1,
	                x2, y2
	            );
	        }
	        else {
	            if (percent < 1) {
	                cubicSubdivide(
	                    x1, cpx1, cpx2, x2, percent, out
	                );
	                cpx1 = out[1];
	                cpx2 = out[2];
	                x2 = out[3];
	                cubicSubdivide(
	                    y1, cpy1, cpy2, y2, percent, out
	                );
	                cpy1 = out[1];
	                cpy2 = out[2];
	                y2 = out[3];
	            }
	            ctx.bezierCurveTo(
	                cpx1, cpy1,
	                cpx2, cpy2,
	                x2, y2
	            );
	        }
	    },
	
	    /**
	     * Get point at percent
	     * @param  {number} t
	     * @return {Array.<number>}
	     */
	    pointAt: function (t) {
	        return someVectorAt(this.shape, t, false);
	    },
	
	    /**
	     * Get tangent at percent
	     * @param  {number} t
	     * @return {Array.<number>}
	     */
	    tangentAt: function (t) {
	        var p = someVectorAt(this.shape, t, true);
	        return vec2.normalize(p, p);
	    }
	});
	


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 圆形
	 * @module zrender/shape/Circle
	 */
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'circle',
	
	    shape: {
	        cx: 0,
	        cy: 0,
	        r: 0
	    },
	
	
	    buildPath: function (ctx, shape, inBundle) {
	        // Better stroking in ShapeBundle
	        // Always do it may have performence issue ( fill may be 2x more cost)
	        if (inBundle) {
	            ctx.moveTo(shape.cx + shape.r, shape.cy);
	        }
	        // Better stroking in ShapeBundle
	        // ctx.moveTo(shape.cx + shape.r, shape.cy);
	        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
	    }
	});
	


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 水滴形状
	 * @module zrender/graphic/shape/Droplet
	 */
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'droplet',
	
	    shape: {
	        cx: 0, cy: 0,
	        width: 0, height: 0
	    },
	
	    buildPath: function (ctx, shape) {
	        var x = shape.cx;
	        var y = shape.cy;
	        var a = shape.width;
	        var b = shape.height;
	
	        ctx.moveTo(x, y + a);
	        ctx.bezierCurveTo(
	            x + a,
	            y + a,
	            x + a * 3 / 2,
	            y - a / 3,
	            x,
	            y - b
	        );
	        ctx.bezierCurveTo(
	            x - a * 3 / 2,
	            y - a / 3,
	            x - a,
	            y + a,
	            x,
	            y + a
	        );
	        ctx.closePath();
	    }
	});
	


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 椭圆形状
	 * @module zrender/graphic/shape/Ellipse
	 */
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'ellipse',
	
	    shape: {
	        cx: 0, cy: 0,
	        rx: 0, ry: 0
	    },
	
	    buildPath: function (ctx, shape) {
	        var k = 0.5522848;
	        var x = shape.cx;
	        var y = shape.cy;
	        var a = shape.rx;
	        var b = shape.ry;
	        var ox = a * k; // 水平控制点偏移量
	        var oy = b * k; // 垂直控制点偏移量
	        // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
	        ctx.moveTo(x - a, y);
	        ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
	        ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
	        ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
	        ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
	        ctx.closePath();
	    }
	});
	


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 心形
	 * @module zrender/graphic/shape/Heart
	 */
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'heart',
	
	    shape: {
	        cx: 0,
	        cy: 0,
	        width: 0,
	        height: 0
	    },
	
	    buildPath: function (ctx, shape) {
	        var x = shape.cx;
	        var y = shape.cy;
	        var a = shape.width;
	        var b = shape.height;
	        ctx.moveTo(x, y);
	        ctx.bezierCurveTo(
	            x + a / 2, y - b * 2 / 3,
	            x + a * 2, y + b / 3,
	            x, y + b
	        );
	        ctx.bezierCurveTo(
	            x - a * 2, y + b / 3,
	            x - a / 2, y - b * 2 / 3,
	            x, y
	        );
	    }
	});
	


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 正多边形
	 * @module zrender/shape/Isogon
	 * @author sushuang (宿爽, sushuang0322@gmail.com)
	 */
	
	var PI = Math.PI;
	var sin = Math.sin;
	var cos = Math.cos;
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'isogon',
	
	    shape: {
	        x: 0, y: 0,
	        r: 0, n: 0
	    },
	
	    buildPath: function (ctx, shape) {
	        var n = shape.n;
	        if (!n || n < 2) {
	            return;
	        }
	
	        var x = shape.x;
	        var y = shape.y;
	        var r = shape.r;
	
	        var dStep = 2 * PI / n;
	        var deg = -PI / 2;
	
	        ctx.moveTo(x + r * cos(deg), y + r * sin(deg));
	        for (var i = 0, end = n - 1; i < end; i++) {
	            deg += dStep;
	            ctx.lineTo(x + r * cos(deg), y + r * sin(deg));
	        }
	
	        ctx.closePath();
	
	        return;
	    }
	});
	


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 直线
	 * @module zrender/graphic/shape/Line
	 */
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'line',
	
	    shape: {
	        // Start point
	        x1: 0,
	        y1: 0,
	        // End point
	        x2: 0,
	        y2: 0,
	
	        percent: 1
	    },
	
	    style: {
	        stroke: '#000000',
	        fill: null
	    },
	
	    buildPath: function (ctx, shape) {
	        var x1 = shape.x1;
	        var y1 = shape.y1;
	        var x2 = shape.x2;
	        var y2 = shape.y2;
	        var percent = shape.percent;
	
	        if (percent === 0) {
	            return;
	        }
	
	        ctx.moveTo(x1, y1);
	
	        if (percent < 1) {
	            x2 = x1 * (1 - percent) + x2 * percent;
	            y2 = y1 * (1 - percent) + y2 * percent;
	        }
	        ctx.lineTo(x2, y2);
	    },
	
	    /**
	     * Get point at percent
	     * @param  {number} percent
	     * @return {Array.<number>}
	     */
	    pointAt: function (p) {
	        var shape = this.shape;
	        return [
	            shape.x1 * (1 - p) + shape.x2 * p,
	            shape.y1 * (1 - p) + shape.y2 * p
	        ];
	    }
	});
	


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @module zrender/graphic/shape/Polyline
	 */
	
	var polyHelper = __webpack_require__(42);
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'polyline',
	
	    shape: {
	        points: null,
	
	        smooth: false,
	
	        smoothConstraint: null
	    },
	
	    style: {
	        stroke: '#000000',
	
	        fill: null
	    },
	
	    buildPath: function (ctx, shape) {
	        polyHelper.buildPath(ctx, shape, false);
	    }
	});


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var smoothSpline = __webpack_require__(43);
	    var smoothBezier = __webpack_require__(44);
	
	    module.exports = {
	        buildPath: function (ctx, shape, closePath) {
	            var points = shape.points;
	            var smooth = shape.smooth;
	            if (points && points.length >= 2) {
	                if (smooth && smooth !== 'spline') {
	                    var controlPoints = smoothBezier(
	                        points, smooth, closePath, shape.smoothConstraint
	                    );
	
	                    ctx.moveTo(points[0][0], points[0][1]);
	                    var len = points.length;
	                    for (var i = 0; i < (closePath ? len : len - 1); i++) {
	                        var cp1 = controlPoints[i * 2];
	                        var cp2 = controlPoints[i * 2 + 1];
	                        var p = points[(i + 1) % len];
	                        ctx.bezierCurveTo(
	                            cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]
	                        );
	                    }
	                }
	                else {
	                    if (smooth === 'spline') {
	                        points = smoothSpline(points, closePath);
	                    }
	
	                    ctx.moveTo(points[0][0], points[0][1]);
	                    for (var i = 1, l = points.length; i < l; i++) {
	                        ctx.lineTo(points[i][0], points[i][1]);
	                    }
	                }
	
	                closePath && ctx.closePath();
	            }
	        }
	    };


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Catmull-Rom spline 插值折线
	 * @module zrender/shape/util/smoothSpline
	 * @author pissang (https://www.github.com/pissang)
	 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 */
	
	    var vec2 = __webpack_require__(2);
	
	    /**
	     * @inner
	     */
	    function interpolate(p0, p1, p2, p3, t, t2, t3) {
	        var v0 = (p2 - p0) * 0.5;
	        var v1 = (p3 - p1) * 0.5;
	        return (2 * (p1 - p2) + v0 + v1) * t3
	                + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
	                + v0 * t + p1;
	    }
	
	    /**
	     * @alias module:zrender/shape/util/smoothSpline
	     * @param {Array} points 线段顶点数组
	     * @param {boolean} isLoop
	     * @return {Array}
	     */
	    module.exports = function (points, isLoop) {
	        var len = points.length;
	        var ret = [];
	
	        var distance = 0;
	        for (var i = 1; i < len; i++) {
	            distance += vec2.distance(points[i - 1], points[i]);
	        }
	
	        var segs = distance / 2;
	        segs = segs < len ? len : segs;
	        for (var i = 0; i < segs; i++) {
	            var pos = i / (segs - 1) * (isLoop ? len : len - 1);
	            var idx = Math.floor(pos);
	
	            var w = pos - idx;
	
	            var p0;
	            var p1 = points[idx % len];
	            var p2;
	            var p3;
	            if (!isLoop) {
	                p0 = points[idx === 0 ? idx : idx - 1];
	                p2 = points[idx > len - 2 ? len - 1 : idx + 1];
	                p3 = points[idx > len - 3 ? len - 1 : idx + 2];
	            }
	            else {
	                p0 = points[(idx - 1 + len) % len];
	                p2 = points[(idx + 1) % len];
	                p3 = points[(idx + 2) % len];
	            }
	
	            var w2 = w * w;
	            var w3 = w * w2;
	
	            ret.push([
	                interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
	                interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)
	            ]);
	        }
	        return ret;
	    };
	


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 贝塞尔平滑曲线
	 * @module zrender/shape/util/smoothBezier
	 * @author pissang (https://www.github.com/pissang)
	 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 */
	
	
	    var vec2 = __webpack_require__(2);
	    var v2Min = vec2.min;
	    var v2Max = vec2.max;
	    var v2Scale = vec2.scale;
	    var v2Distance = vec2.distance;
	    var v2Add = vec2.add;
	
	    /**
	     * 贝塞尔平滑曲线
	     * @alias module:zrender/shape/util/smoothBezier
	     * @param {Array} points 线段顶点数组
	     * @param {number} smooth 平滑等级, 0-1
	     * @param {boolean} isLoop
	     * @param {Array} constraint 将计算出来的控制点约束在一个包围盒内
	     *                           比如 [[0, 0], [100, 100]], 这个包围盒会与
	     *                           整个折线的包围盒做一个并集用来约束控制点。
	     * @param {Array} 计算出来的控制点数组
	     */
	    module.exports = function (points, smooth, isLoop, constraint) {
	        var cps = [];
	
	        var v = [];
	        var v1 = [];
	        var v2 = [];
	        var prevPoint;
	        var nextPoint;
	
	        var min, max;
	        if (constraint) {
	            min = [Infinity, Infinity];
	            max = [-Infinity, -Infinity];
	            for (var i = 0, len = points.length; i < len; i++) {
	                v2Min(min, min, points[i]);
	                v2Max(max, max, points[i]);
	            }
	            // 与指定的包围盒做并集
	            v2Min(min, min, constraint[0]);
	            v2Max(max, max, constraint[1]);
	        }
	
	        for (var i = 0, len = points.length; i < len; i++) {
	            var point = points[i];
	
	            if (isLoop) {
	                prevPoint = points[i ? i - 1 : len - 1];
	                nextPoint = points[(i + 1) % len];
	            }
	            else {
	                if (i === 0 || i === len - 1) {
	                    cps.push(vec2.clone(points[i]));
	                    continue;
	                }
	                else {
	                    prevPoint = points[i - 1];
	                    nextPoint = points[i + 1];
	                }
	            }
	
	            vec2.sub(v, nextPoint, prevPoint);
	
	            // use degree to scale the handle length
	            v2Scale(v, v, smooth);
	
	            var d0 = v2Distance(point, prevPoint);
	            var d1 = v2Distance(point, nextPoint);
	            var sum = d0 + d1;
	            if (sum !== 0) {
	                d0 /= sum;
	                d1 /= sum;
	            }
	
	            v2Scale(v1, v, -d0);
	            v2Scale(v2, v, d1);
	            var cp0 = v2Add([], point, v1);
	            var cp1 = v2Add([], point, v2);
	            if (constraint) {
	                v2Max(cp0, cp0, min);
	                v2Min(cp0, cp0, max);
	                v2Max(cp1, cp1, min);
	                v2Min(cp1, cp1, max);
	            }
	            cps.push(cp0);
	            cps.push(cp1);
	        }
	
	        if (isLoop) {
	            cps.push(cps.shift());
	        }
	
	        return cps;
	    };
	


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 多边形
	 * @module zrender/shape/Polygon
	 */
	
	var polyHelper = __webpack_require__(42);
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'polygon',
	
	    shape: {
	        points: null,
	
	        smooth: false,
	
	        smoothConstraint: null
	    },
	
	    buildPath: function (ctx, shape) {
	        polyHelper.buildPath(ctx, shape, true);
	    }
	});


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 矩形
	 * @module zrender/graphic/shape/Rect
	 */
	
	var roundRectHelper = __webpack_require__(47);
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'rect',
	
	    shape: {
	        // 左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
	        // r缩写为1         相当于 [1, 1, 1, 1]
	        // r缩写为[1]       相当于 [1, 1, 1, 1]
	        // r缩写为[1, 2]    相当于 [1, 2, 1, 2]
	        // r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
	        r: 0,
	
	        x: 0,
	        y: 0,
	        width: 0,
	        height: 0
	    },
	
	    buildPath: function (ctx, shape) {
	        var x = shape.x;
	        var y = shape.y;
	        var width = shape.width;
	        var height = shape.height;
	        if (!shape.r) {
	            ctx.rect(x, y, width, height);
	        }
	        else {
	            roundRectHelper.buildPath(ctx, shape);
	        }
	        ctx.closePath();
	        return;
	    }
	});
	


/***/ },
/* 47 */
/***/ function(module, exports) {

	
	
	    module.exports = {
	        buildPath: function (ctx, shape) {
	            var x = shape.x;
	            var y = shape.y;
	            var width = shape.width;
	            var height = shape.height;
	            var r = shape.r;
	            var r1;
	            var r2;
	            var r3;
	            var r4;
	
	            // Convert width and height to positive for better borderRadius
	            if (width < 0) {
	                x = x + width;
	                width = -width;
	            }
	            if (height < 0) {
	                y = y + height;
	                height = -height;
	            }
	
	            if (typeof r === 'number') {
	                r1 = r2 = r3 = r4 = r;
	            }
	            else if (r instanceof Array) {
	                if (r.length === 1) {
	                    r1 = r2 = r3 = r4 = r[0];
	                }
	                else if (r.length === 2) {
	                    r1 = r3 = r[0];
	                    r2 = r4 = r[1];
	                }
	                else if (r.length === 3) {
	                    r1 = r[0];
	                    r2 = r4 = r[1];
	                    r3 = r[2];
	                }
	                else {
	                    r1 = r[0];
	                    r2 = r[1];
	                    r3 = r[2];
	                    r4 = r[3];
	                }
	            }
	            else {
	                r1 = r2 = r3 = r4 = 0;
	            }
	
	            var total;
	            if (r1 + r2 > width) {
	                total = r1 + r2;
	                r1 *= width / total;
	                r2 *= width / total;
	            }
	            if (r3 + r4 > width) {
	                total = r3 + r4;
	                r3 *= width / total;
	                r4 *= width / total;
	            }
	            if (r2 + r3 > height) {
	                total = r2 + r3;
	                r2 *= height / total;
	                r3 *= height / total;
	            }
	            if (r1 + r4 > height) {
	                total = r1 + r4;
	                r1 *= height / total;
	                r4 *= height / total;
	            }
	            ctx.moveTo(x + r1, y);
	            ctx.lineTo(x + width - r2, y);
	            r2 !== 0 && ctx.quadraticCurveTo(
	                x + width, y, x + width, y + r2
	            );
	            ctx.lineTo(x + width, y + height - r3);
	            r3 !== 0 && ctx.quadraticCurveTo(
	                x + width, y + height, x + width - r3, y + height
	            );
	            ctx.lineTo(x + r4, y + height);
	            r4 !== 0 && ctx.quadraticCurveTo(
	                x, y + height, x, y + height - r4
	            );
	            ctx.lineTo(x, y + r1);
	            r1 !== 0 && ctx.quadraticCurveTo(x, y, x + r1, y);
	        }
	    };


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 圆环
	 * @module zrender/graphic/shape/Ring
	 */
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'ring',
	
	    shape: {
	        cx: 0,
	        cy: 0,
	        r: 0,
	        r0: 0
	    },
	
	    buildPath: function (ctx, shape) {
	        var x = shape.cx;
	        var y = shape.cy;
	        var PI2 = Math.PI * 2;
	        ctx.moveTo(x + shape.r, y);
	        ctx.arc(x, y, shape.r, 0, PI2, false);
	        ctx.moveTo(x + shape.r0, y);
	        ctx.arc(x, y, shape.r0, 0, PI2, true);
	    }
	});
	


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 玫瑰线
	 * @module zrender/graphic/shape/Rose
	 */
	
	var sin = Math.sin;
	var cos = Math.cos;
	var radian = Math.PI / 180;
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'rose',
	
	    shape: {
	        cx: 0,
	        cy: 0,
	        r: [],
	        k: 0,
	        n: 1
	    },
	
	    style: {
	        stroke: '#000000',
	        fill: null
	    },
	
	    buildPath: function (ctx, shape) {
	        var x;
	        var y;
	        var R = shape.r;
	        var r;
	        var k = shape.k;
	        var n = shape.n;
	
	        var x0 = shape.cx;
	        var y0 = shape.cy;
	
	        ctx.moveTo(x0, y0);
	
	        for (var i = 0, len = R.length; i < len; i++) {
	            r = R[i];
	
	            for (var j = 0; j <= 360 * n; j++) {
	                x = r
	                    * sin(k / n * j % 360 * radian)
	                    * cos(j * radian)
	                    + x0;
	                y = r
	                    * sin(k / n * j % 360 * radian)
	                    * sin(j * radian)
	                    + y0;
	                ctx.lineTo(x, y);
	            }
	        }
	    }
	});
	


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 扇形
	 * @module zrender/graphic/shape/Sector
	 */
	
	var Path = __webpack_require__(20);
	
	module.exports = Path.extend({
	
	    type: 'sector',
	
	    shape: {
	
	        cx: 0,
	
	        cy: 0,
	
	        r0: 0,
	
	        r: 0,
	
	        startAngle: 0,
	
	        endAngle: Math.PI * 2,
	
	        clockwise: true
	    },
	
	    buildPath: function (ctx, shape) {
	
	        var x = shape.cx;
	        var y = shape.cy;
	        var r0 = Math.max(shape.r0 || 0, 0);
	        var r = Math.max(shape.r, 0);
	        var startAngle = shape.startAngle;
	        var endAngle = shape.endAngle;
	        var clockwise = shape.clockwise;
	
	        var unitX = Math.cos(startAngle);
	        var unitY = Math.sin(startAngle);
	
	        ctx.moveTo(unitX * r0 + x, unitY * r0 + y);
	
	        ctx.lineTo(unitX * r + x, unitY * r + y);
	
	        ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
	
	        ctx.lineTo(
	            Math.cos(endAngle) * r0 + x,
	            Math.sin(endAngle) * r0 + y
	        );
	
	        if (r0 !== 0) {
	            ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
	        }
	
	        ctx.closePath();
	    }
	});
	


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * n角星（n>3）
	 * @module zrender/graphic/shape/Star
	 */
	
	var PI = Math.PI;
	
	var cos = Math.cos;
	var sin = Math.sin;
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'star',
	
	    shape: {
	        cx: 0,
	        cy: 0,
	        n: 3,
	        r0: null,
	        r: 0
	    },
	
	    buildPath: function (ctx, shape) {
	
	        var n = shape.n;
	        if (!n || n < 2) {
	            return;
	        }
	
	        var x = shape.cx;
	        var y = shape.cy;
	        var r = shape.r;
	        var r0 = shape.r0;
	
	        // 如果未指定内部顶点外接圆半径，则自动计算
	        if (r0 == null) {
	            r0 = n > 4
	                // 相隔的外部顶点的连线的交点，
	                // 被取为内部交点，以此计算r0
	                ? r * cos(2 * PI / n) / cos(PI / n)
	                // 二三四角星的特殊处理
	                : r / 3;
	        }
	
	        var dStep = PI / n;
	        var deg = -PI / 2;
	        var xStart = x + r * cos(deg);
	        var yStart = y + r * sin(deg);
	        deg += dStep;
	
	        // 记录边界点，用于判断inside
	        ctx.moveTo(xStart, yStart);
	        for (var i = 0, end = n * 2 - 1, ri; i < end; i++) {
	            ri = i % 2 === 0 ? r0 : r;
	            ctx.lineTo(x + ri * cos(deg), y + ri * sin(deg));
	            deg += dStep;
	        }
	
	        ctx.closePath();
	    }
	});
	


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 内外旋轮曲线
	 * @module zrender/graphic/shape/Trochoid
	 */
	
	var cos = Math.cos;
	var sin = Math.sin;
	
	module.exports = __webpack_require__(20).extend({
	
	    type: 'trochoid',
	
	    shape: {
	        cx: 0,
	        cy: 0,
	        r: 0,
	        r0: 0,
	        d: 0,
	        location: 'out'
	    },
	
	    style: {
	        stroke: '#000000',
	
	        fill: null
	    },
	
	    buildPath: function (ctx, shape) {
	        var x1;
	        var y1;
	        var x2;
	        var y2;
	        var R = shape.r;
	        var r = shape.r0;
	        var d = shape.d;
	        var offsetX = shape.cx;
	        var offsetY = shape.cy;
	        var delta = shape.location == 'out' ? 1 : -1;
	
	        if (shape.location && R <= r) {
	            return;
	        }
	
	        var num = 0;
	        var i = 1;
	        var theta;
	
	        x1 = (R + delta * r) * cos(0)
	            - delta * d * cos(0) + offsetX;
	        y1 = (R + delta * r) * sin(0)
	            - d * sin(0) + offsetY;
	
	        ctx.moveTo(x1, y1);
	
	        // 计算结束时的i
	        do {
	            num++;
	        }
	        while ((r * num) % (R + delta * r) !== 0);
	
	        do {
	            theta = Math.PI / 180 * i;
	            x2 = (R + delta * r) * cos(theta)
	                - delta * d * cos((R / r + delta) * theta)
	                + offsetX;
	            y2 = (R + delta * r) * sin(theta)
	                - d * sin((R / r + delta) * theta)
	                + offsetY;
	            ctx.lineTo(x2, y2);
	            i++;
	        }
	        while (i <= (r * num) / (R + delta * r) * 360);
	
	    }
	});
	


/***/ },
/* 53 */
/***/ function(module, exports) {

	/**
	 * @param {Array.<Object>} colorStops
	 */
	var Gradient = function (colorStops) {
	
	    this.colorStops = colorStops || [];
	};
	
	Gradient.prototype = {
	
	    constructor: Gradient,
	
	    addColorStop: function (offset, color) {
	        this.colorStops.push({
	
	            offset: offset,
	
	            color: color
	        });
	    }
	};
	
	module.exports = Gradient;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	var zrUtil = __webpack_require__(5);
	
	var Gradient = __webpack_require__(53);
	
	/**
	 * x, y, x2, y2 are all percent from 0 to 1
	 * @param {number} [x=0]
	 * @param {number} [y=0]
	 * @param {number} [x2=1]
	 * @param {number} [y2=0]
	 * @param {Array.<Object>} colorStops
	 * @param {boolean} [globalCoord=false]
	 */
	var LinearGradient = function (x, y, x2, y2, colorStops, globalCoord) {
	    this.x = x == null ? 0 : x;
	
	    this.y = y == null ? 0 : y;
	
	    this.x2 = x2 == null ? 1 : x2;
	
	    this.y2 = y2 == null ? 0 : y2;
	
	    // Can be cloned
	    this.type = 'linear';
	
	    // If use global coord
	    this.global = globalCoord || false;
	
	    Gradient.call(this, colorStops);
	};
	
	LinearGradient.prototype = {
	
	    constructor: LinearGradient
	};
	
	zrUtil.inherits(LinearGradient, Gradient);
	
	module.exports = LinearGradient;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	var zrUtil = __webpack_require__(5);
	
	var Gradient = __webpack_require__(53);
	
	/**
	 * x, y, r are all percent from 0 to 1
	 * @param {number} [x=0.5]
	 * @param {number} [y=0.5]
	 * @param {number} [r=0.5]
	 * @param {Array.<Object>} [colorStops]
	 * @param {boolean} [globalCoord=false]
	 */
	var RadialGradient = function (x, y, r, colorStops, globalCoord) {
	    this.x = x == null ? 0.5 : x;
	
	    this.y = y == null ? 0.5 : y;
	
	    this.r = r == null ? 0.5 : r;
	
	    // Can be cloned
	    this.type = 'radial';
	
	    // If use global coord
	    this.global = globalCoord || false;
	
	    Gradient.call(this, colorStops);
	};
	
	RadialGradient.prototype = {
	
	    constructor: RadialGradient
	};
	
	zrUtil.inherits(RadialGradient, Gradient);
	
	module.exports = RadialGradient;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Text element
	 * @module zrender/graphic/Text
	 *
	 * TODO Wrapping
	 *
	 * Text not support gradient
	 */
	
	var Displayable = __webpack_require__(21);
	var zrUtil = __webpack_require__(5);
	var textContain = __webpack_require__(24);
	
	/**
	 * @alias zrender/graphic/Text
	 * @extends module:zrender/graphic/Displayable
	 * @constructor
	 * @param {Object} opts
	 */
	var Text = function (opts) {
	    Displayable.call(this, opts);
	};
	
	Text.prototype = {
	
	    constructor: Text,
	
	    type: 'text',
	
	    brush: function (ctx, prevEl) {
	        var style = this.style;
	        var x = style.x || 0;
	        var y = style.y || 0;
	        // Convert to string
	        var text = style.text;
	
	        // Convert to string
	        text != null && (text += '');
	
	        // Always bind style
	        style.bind(ctx, this, prevEl);
	
	        if (text) {
	
	            this.setTransform(ctx);
	
	            var textBaseline;
	            var textAlign = style.textAlign;
	            var font = style.textFont || style.font;
	            if (style.textVerticalAlign) {
	                var rect = textContain.getBoundingRect(
	                    text, font, style.textAlign, 'top'
	                );
	                // Ignore textBaseline
	                textBaseline = 'middle';
	                switch (style.textVerticalAlign) {
	                    case 'middle':
	                        y -= rect.height / 2 - rect.lineHeight / 2;
	                        break;
	                    case 'bottom':
	                        y -= rect.height - rect.lineHeight / 2;
	                        break;
	                    default:
	                        y += rect.lineHeight / 2;
	                }
	            }
	            else {
	                textBaseline = style.textBaseline;
	            }			
			
	            // TODO Invalid font			
				var fontSize = parseInt(
					(font || '18 simsun').split(' ')[0].replace('px', ''));
				ctx.setFontSize(fontSize);
	
	            ctx.textAlign = textAlign || 'left';
	            // Use canvas default left textAlign. Giving invalid value will cause state not change
	            if (ctx.textAlign !== textAlign) {
	                ctx.textAlign = 'left';
	            }
	            ctx.textBaseline = textBaseline || 'alphabetic';
	            // Use canvas default alphabetic baseline
	            if (ctx.textBaseline !== textBaseline) {
	                ctx.textBaseline = 'alphabetic';
	            }
	
	            var lineHeight = textContain.measureText('国', fontSize).width;
	
	            var textLines = text.split('\n');
	            for (var i = 0; i < textLines.length; i++) {
	                
	                style.hasFill() && ctx.fillText(textLines[i], x, y);
	                
	                style.hasStroke() && ctx.strokeText(textLines[i], x, y);
	                y += lineHeight;
	            }
	
	            this.restoreTransform(ctx);
	        }
	    },
	
	    getBoundingRect: function () {
	        if (!this._rect) {
	            var style = this.style;
	            var textVerticalAlign = style.textVerticalAlign;
	            var rect = textContain.getBoundingRect(
	                style.text + '', style.textFont || style.font, style.textAlign,
	                textVerticalAlign ? 'top' : style.textBaseline
	            );
	            switch (textVerticalAlign) {
	                case 'middle':
	                    rect.y -= rect.height / 2;
	                    break;
	                case 'bottom':
	                    rect.y -= rect.height;
	                    break;
	            }
	            rect.x += style.x || 0;
	            rect.y += style.y || 0;
	            this._rect = rect;
	        }
	        return this._rect;
	    }
	};
	
	zrUtil.inherits(Text, Displayable);
	
	module.exports = Text;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Image element
	 * @module zrender/graphic/Image
	 */
	
	var Displayable = __webpack_require__(21);
	var BoundingRect = __webpack_require__(18);
	var zrUtil = __webpack_require__(5);
	
	/**
	 * @alias zrender/graphic/Image
	 * @extends module:zrender/graphic/Displayable
	 * @constructor
	 * @param {Object} opts
	 */
	function ZImage(opts) {
	    Displayable.call(this, opts);
	}
	
	ZImage.prototype = {
	
	    constructor: ZImage,
	
	    type: 'image',
	
	    brush: function (ctx, prevEl) {
	        var style = this.style;
	        var image = style.image;
	
	        // Must bind each time
	        style.bind(ctx, this, prevEl);
	
	        var width = style.width;
	        var height = style.height;
	        var x = style.x || 0;
	        var y = style.y || 0;
	
	        // 设置transform
	        this.setTransform(ctx);
	
	        ctx.drawImage(
	            image,
	            x, y, width, height
	        );
	
	        // Draw rect text
	        if (style.text != null) {
	            this.drawRectText(ctx, this.getBoundingRect());
	        }
	
	    },
	
	    getBoundingRect: function () {
	        var style = this.style;
	        if (!this._rect) {
	            this._rect = new BoundingRect(
	                style.x || 0, style.y || 0, style.width || 0, style.height || 0
	            );
	        }
	        return this._rect;
	    }
	};
	
	zrUtil.inherits(ZImage, Displayable);
	
	module.exports = ZImage;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 动画主类, 调度和管理所有动画控制器
	 *
	 * @module zrender/animation/Animation
	 * @author pissang(https://github.com/pissang)
	 */
	// TODO Additive animation
	// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
	// https://developer.apple.com/videos/wwdc2014/#236
	
	
	var util = __webpack_require__(5);
	var Dispatcher = __webpack_require__(59).Dispatcher;
	
	var requestAnimationFrame = __webpack_require__(60);
	
	var Animator = __webpack_require__(12);
	/**
	 * @typedef {Object} IZRenderStage
	 * @property {Function} update
	 */
	
	/**
	 * @alias module:zrender/animation/Animation
	 * @constructor
	 * @param {Object} [options]
	 * @param {Function} [options.onframe]
	 * @param {IZRenderStage} [options.stage]
	 * @example
	 *     var animation = new Animation();
	 *     var obj = {
	 *         x: 100,
	 *         y: 100
	 *     };
	 *     animation.animate(node.position)
	 *         .when(1000, {
	 *             x: 500,
	 *             y: 500
	 *         })
	 *         .when(2000, {
	 *             x: 100,
	 *             y: 100
	 *         })
	 *         .start('spline');
	 */
	var Animation = function (options) {
	
	    options = options || {};
	
	    this.stage = options.stage || {};
	
	    this.onframe = options.onframe || function () { };
	
	    // private properties
	    this._clips = [];
	
	    this._running = false;
	
	    this._time;
	
	    this._pausedTime;
	
	    this._pauseStart;
	
	    this._paused = false;
	
	    Dispatcher.call(this);
	};
	
	Animation.prototype = {
	
	    constructor: Animation,
	    /**
	     * 添加 clip
	     * @param {module:zrender/animation/Clip} clip
	     */
	    addClip: function (clip) {
	        this._clips.push(clip);
	    },
	    /**
	     * 添加 animator
	     * @param {module:zrender/animation/Animator} animator
	     */
	    addAnimator: function (animator) {
	        animator.animation = this;
	        var clips = animator.getClips();
	        for (var i = 0; i < clips.length; i++) {
	            this.addClip(clips[i]);
	        }
	    },
	    /**
	     * 删除动画片段
	     * @param {module:zrender/animation/Clip} clip
	     */
	    removeClip: function (clip) {
	        var idx = util.indexOf(this._clips, clip);
	        if (idx >= 0) {
	            this._clips.splice(idx, 1);
	        }
	    },
	
	    /**
	     * 删除动画片段
	     * @param {module:zrender/animation/Animator} animator
	     */
	    removeAnimator: function (animator) {
	        var clips = animator.getClips();
	        for (var i = 0; i < clips.length; i++) {
	            this.removeClip(clips[i]);
	        }
	        animator.animation = null;
	    },
	
	    _update: function () {
	
	
	        var time = new Date().getTime() - this._pausedTime;
	        var delta = time - this._time;
	        var clips = this._clips;
	        var len = clips.length;
	
	        var deferredEvents = [];
	        var deferredClips = [];
	        for (var i = 0; i < len; i++) {
	            var clip = clips[i];
	            var e = clip.step(time);
	            // Throw out the events need to be called after
	            // stage.update, like destroy
	            if (e) {
	                deferredEvents.push(e);
	                deferredClips.push(clip);
	            }
	        }
	
	        // Remove the finished clip
	        for (var i = 0; i < len;) {
	            if (clips[i]._needsRemove) {
	                clips[i] = clips[len - 1];
	                clips.pop();
	                len--;
	            }
	            else {
	                i++;
	            }
	        }
	
	        len = deferredEvents.length;
	        for (var i = 0; i < len; i++) {
	            deferredClips[i].fire(deferredEvents[i]);
	        }
	
	        this._time = time;
	
	        this.onframe(delta);
	
	        this.trigger('frame', delta);
	
			
	        if (this.stage.update) {
	            this.stage.update();
	        }
			
	    },
	
	    _startLoop: function () {
	        var self = this;
	
	        this._running = true;
	
	        function step() {
	            if (self._running) {
	
	                requestAnimationFrame(step);
	
	                !self._paused && self._update();
	            }
	        }
	
	        requestAnimationFrame(step);
	    },
	
	    /**
	     * 开始运行动画
	     */
	    start: function () {
	
	        this._time = new Date().getTime();
	        this._pausedTime = 0;
	
	        this._startLoop();
	    },
	    /**
	     * 停止运行动画
	     */
	    stop: function () {
	        this._running = false;
	    },
	
	    /**
	     * Pause
	     */
	    pause: function () {
	        if (!this._paused) {
	            this._pauseStart = new Date().getTime();
	            this._paused = true;
	        }
	    },
	
	    /**
	     * Resume
	     */
	    resume: function () {
	        if (this._paused) {
	            this._pausedTime += (new Date().getTime()) - this._pauseStart;
	            this._paused = false;
	        }
	    },
	
	    /**
	     * 清除所有动画片段
	     */
	    clear: function () {
	        this._clips = [];
	    },
	    /**
	     * 对一个目标创建一个animator对象，可以指定目标中的属性使用动画
	     * @param  {Object} target
	     * @param  {Object} options
	     * @param  {boolean} [options.loop=false] 是否循环播放动画
	     * @param  {Function} [options.getter=null]
	     *         如果指定getter函数，会通过getter函数取属性值
	     * @param  {Function} [options.setter=null]
	     *         如果指定setter函数，会通过setter函数设置属性值
	     * @return {module:zrender/animation/Animation~Animator}
	     */
	    // TODO Gap
	    animate: function (target, options) {
	        options = options || {};
	        var animator = new Animator(
	            target,
	            options.loop,
	            options.getter,
	            options.setter
	        );
	
	        return animator;
	    }
	};
	
	util.mixin(Animation, Dispatcher);
	
	module.exports = Animation;
	


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 事件辅助类
	 * @module zrender/core/event
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 */
	
	
	    var Eventful = __webpack_require__(8);   
	
	    function getBoundingClientRect(el) {
	        // BlackBerry 5, iOS 3 (original iPhone) don't have getBoundingRect
	        return el.getBoundingClientRect ? el.getBoundingClientRect() : {left: 0, top: 0};
	    }
	
	    // `calculate` is optional, default false
	    function clientToLocal(el, e, out, calculate) {
	        out = out || {};
	
	        // According to the W3C Working Draft, offsetX and offsetY should be relative
	        // to the padding edge of the target element. The only browser using this convention
	        // is IE. Webkit uses the border edge, Opera uses the content edge, and FireFox does
	        // not support the properties.
	        // (see http://www.jacklmoore.com/notes/mouse-position/)
	        // In zr painter.dom, padding edge equals to border edge.
	
	        // FIXME
	        // When mousemove event triggered on ec tooltip, target is not zr painter.dom, and
	        // offsetX/Y is relative to e.target, where the calculation of zrX/Y via offsetX/Y
	        // is too complex. So css-transfrom dont support in this case temporarily.
	        if (calculate || true) {
	            defaultGetZrXY(el, e, out);
	        }       
	        // For IE6+, chrome, safari, opera. (When will ff support offsetX?)
	        else if (e.offsetX != null) {
	            out.zrX = e.offsetX;
	            out.zrY = e.offsetY;
	        }
	        // For some other device, e.g., IOS safari.
	        else {
	            defaultGetZrXY(el, e, out);
	        }
	
	        return out;
	    }
	
	    function defaultGetZrXY(el, e, out) {
	        // This well-known method below does not support css transform.
	        var box = getBoundingClientRect(el);
	        out.zrX = e.clientX - box.left;
	        out.zrY = e.clientY - box.top;
	    }
	
	    /**
	     * 如果存在第三方嵌入的一些dom触发的事件，或touch事件，需要转换一下事件坐标.
	     * `calculate` is optional, default false.
	     */
	    function normalizeEvent(el, e, calculate) {    
	
	        if (e.zrX != null) {
	            return e;
	        }
	
	        var eventType = e.type;
	        var isTouch = eventType && eventType.indexOf('touch') >= 0;
	
	        if (!isTouch) {
	            clientToLocal(el, e, e, calculate);
	            e.zrDelta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
	        }
	        else {
	            var touch = eventType != 'touchend'
	                ? e.targetTouches[0]
	                : e.changedTouches[0];
	            touch && clientToLocal(el, touch, e, calculate);
	        }
	
	        return e;
	    }
	
	    function addEventListener(el, name, handler) {
	       
	        el.attachEvent('on' + name, handler);
	    }
	
	    function removeEventListener(el, name, handler) {
	      
	        el.detachEvent('on' + name, handler);
	
	    }
	
	    /**
	     * 停止冒泡和阻止默认行为
	     * @memberOf module:zrender/core/event
	     * @method
	     * @param {Event} e : event对象
	     */
	    var stop = function (e) {
	            e.returnValue = false;
	            e.cancelBubble = true;
	        };
	
	    module.exports = {
	        clientToLocal: clientToLocal,
	        normalizeEvent: normalizeEvent,
	        addEventListener: addEventListener,
	        removeEventListener: removeEventListener,
	
	        stop: stop,
	        // 做向上兼容
	        Dispatcher: Eventful
	    };
	


/***/ },
/* 60 */
/***/ function(module, exports) {

	
	module.exports = function (func) {
	    setTimeout(func, 16);
	};
	


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// Global defines
	
	var guid = __webpack_require__(7);
	var zrUtil = __webpack_require__(5);
	var Handler = __webpack_require__(62);
	var Storage = __webpack_require__(64);
	var Animation = __webpack_require__(58);
	var log = __webpack_require__(16);
	
	var painterCtors = {
	    canvas: __webpack_require__(66)
	};
	
	var instances = {};    // ZRender实例map索引
	
	var zrender = {};
	
	/**
	 * @type {string}
	 */
	zrender.version = 'WeZRender';
	
	/*** we
	 * Initializing a zrender instance
	 * @param {string} id
	 * @param {number} width 
	 * @param {number} height
	 * @return {module:zrender/ZRender}
	 */
	zrender.init = function (id, width, height) {
	    var dom = {
	        id: id,
	        width: width,
	        height: height,
	        context: null,
	        getContext: function () {
	            if (!this.context) {
	                var ctx = wx.createCanvasContext(this.id);
	                ctx.id = this.id;
					
	                if (!ctx.setTransform) {
	                    ctx.setTransform = function () { }
	                }
					
					if (!ctx.setTransform) {
						 ctx.measureText = {
	                    
						};
					}               
					
	                this.context = ctx;
	            }
	            return this.context;
	        }
	    };
	    var opts = {};
	    var zr = new ZRender(guid(), dom, opts);
	    instances[zr.id] = zr;
	    return zr;
	};
	/*** we ***/
	
	/**
	 * Dispose zrender instance
	 * @param {module:zrender/ZRender} zr
	 */
	zrender.dispose = function (zr) {
	    if (zr) {
	        zr.dispose();
	    }
	    else {
	        for (var key in instances) {
	            if (instances.hasOwnProperty(key)) {
	                instances[key].dispose();
	            }
	        }
	        instances = {};
	    }
	
	    return zrender;
	};
	
	/**
	 * Get zrender instance by id
	 * @param {string} id zrender instance id
	 * @return {module:zrender/ZRender}
	 */
	zrender.getInstance = function (id) {
	    return instances[id];
	};
	
	zrender.registerPainter = function (name, Ctor) {
	    painterCtors[name] = Ctor;
	};
	
	function delInstance(id) {
	    delete instances[id];
	}
	
	/**
	 * @module zrender/ZRender
	 */
	/**
	 * @constructor
	 * @alias module:zrender/ZRender
	 * @param {string} id
	 * @param {Object} dom
	 * @param {Object} opts
	 */
	var ZRender = function (id, dom, opts) {
	
	    opts = opts || {};
	
	    /**
	     * @type {Object}
	     */
	    this.dom = dom;
	
	    /**
	     * @type {string}
	     */
	    this.id = id;
	
	    var self = this;
	    var storage = new Storage();
	
	    var rendererType = 'canvas';
	
	    var painter = new painterCtors[rendererType](dom, storage, opts);
	
	    this.storage = storage;
	    this.painter = painter;
	
	    var handlerProxy = null;
	
	    this.handler = new Handler(storage, painter, handlerProxy, painter.root);
	
	    /**
	     * @type {module:zrender/animation/Animation}
	     */
	    this.animation = new Animation({
	        stage: {
	            update: zrUtil.bind(this.flush, this)
	        }
	    });
	    this.animation.start();
	
	    /**
	     * @type {boolean}
	     * @private
	     */
	    this._needsRefresh;
	
	    // 修改 storage.delFromMap, 每次删除元素之前删除动画
	    // FIXME 有点ugly
	    var oldDelFromMap = storage.delFromMap;
	    var oldAddToMap = storage.addToMap;
	
	    storage.delFromMap = function (elId) {
	        var el = storage.get(elId);
	
	        oldDelFromMap.call(storage, elId);
	
	        el && el.removeSelfFromZr(self);
	    };
	
	    storage.addToMap = function (el) {
	        oldAddToMap.call(storage, el);
	
	        el.addSelfToZr(self);
	    };
	};
	
	ZRender.prototype = {
	
	    constructor: ZRender,
	    /**
	     * 获取实例唯一标识
	     * @return {string}
	     */
	    getId: function () {
	        return this.id;
	    },
	
	    /**
	     * 添加元素
	     * @param  {module:zrender/Element} el
	     */
	    add: function (el) {
	        this.storage.addRoot(el);
	        this._needsRefresh = true;
	    },
	
	    /**
	     * 删除元素
	     * @param  {module:zrender/Element} el
	     */
	    remove: function (el) {
	        this.storage.delRoot(el);
	        this._needsRefresh = true;
	    },
	
	     /**
	         * Change configuration of layer
	         * @param {string} zLevel
	         * @param {Object} config
	         * @param {string} [config.clearColor=0] Clear color
	         * @param {string} [config.motionBlur=false] If enable motion blur
	         * @param {number} [config.lastFrameAlpha=0.7] Motion blur factor. Larger value cause longer trailer
	        */
	        configLayer: function (zLevel, config) {
	            this.painter.configLayer(zLevel, config);
	            this._needsRefresh = true;
	        },
	
	
	    /**
	     * Repaint the canvas immediately
	     */
	    refreshImmediately: function () {
	        // Clear needsRefresh ahead to avoid something wrong happens in refresh
	        // Or it will cause zrender refreshes again and again.
	        this._needsRefresh = false;
	        this.painter.refresh();
	        /**
	         * Avoid trigger zr.refresh in Element#beforeUpdate hook
	         */
	        this._needsRefresh = false;
	    },
	
	    /**
	     * Mark and repaint the canvas in the next frame of browser
	     */
	    refresh: function () {
	        this._needsRefresh = true;
	    },
	
	    /**
	     * Perform all refresh
	     */
	    flush: function () {
	        if (this._needsRefresh) {
	            this.refreshImmediately();
	        }
	    },
	
	
	    /**
	     * Stop and clear all animation immediately
	     */
	    clearAnimation: function () {
	        this.animation.clear();
	    },
	
	    /**
	     * Get container width
	     */
	    getWidth: function () {
	        return this.painter.getWidth();
	    },
	
	    /**
	     * Get container height
	     */
	    getHeight: function () {
	        return this.painter.getHeight();
	    },
	
	    /**
	     * Bind event
	     *
	     * @param {string} eventName Event name
	     * @param {Function} eventHandler Handler function
	     * @param {Object} [context] Context object
	     */
	    on: function (eventName, eventHandler, context) {
	        this.handler.on(eventName, eventHandler, context);
	    },
	
	    /**
	     * Unbind event
	     * @param {string} eventName Event name
	     * @param {Function} [eventHandler] Handler function
	     */
	    off: function (eventName, eventHandler) {
	        this.handler.off(eventName, eventHandler);
	    },
	
	    /**
	     * Trigger event manually
	     *
	     * @param {string} eventName Event name
	     * @param {event=} event Event object
	     */
	    trigger: function (eventName, event) {
	        this.handler.trigger(eventName, event);
	    },
	
	
	    /**
	     * Clear all objects and the canvas.
	     */
	    clear: function () {
	        this.storage.delRoot();
	        this.painter.clear();
	    },
	
	    /**
	     * Dispose self.
	     */
	    dispose: function () {
	        this.animation.stop();
	
	        this.clear();
	        this.storage.dispose();
	        this.painter.dispose();
	        this.handler.dispose();
	
	        this.animation =
	            this.storage =
	            this.painter =
	            this.handler = null;
	
	        delInstance(this.id);
	    }
	};
	
	module.exports = zrender;
	


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Handler
	 * @module zrender/Handler
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 *         pissang (shenyi.914@gmail.com)
	 */
	
	
	    var util = __webpack_require__(5);
	    var Draggable = __webpack_require__(63);
	
	    var Eventful = __webpack_require__(8);
	
	    function makeEventPacket(eveType, target, event) {
	        return {
	            type: eveType,
	            event: event,
	            target: target,
	            cancelBubble: false,
	            offsetX: event.zrX,
	            offsetY: event.zrY,
	            gestureEvent: event.gestureEvent,
	            pinchX: event.pinchX,
	            pinchY: event.pinchY,
	            pinchScale: event.pinchScale,
	            wheelDelta: event.zrDelta,
	            zrByTouch: event.zrByTouch
	        };
	    }
	
	    function EmptyProxy () {}
	    EmptyProxy.prototype.dispose = function () {};
	
	    var handlerNames = [
	        'click', 'dblclick', 'mousewheel', 'mouseout',
	        'mouseup', 'mousedown', 'mousemove', 'contextmenu'
	    ];
	    /**
	     * @alias module:zrender/Handler
	     * @constructor
	     * @extends module:zrender/mixin/Eventful
	     * @param {module:zrender/Storage} storage Storage instance.
	     * @param {module:zrender/Painter} painter Painter instance.
	     * @param {module:zrender/dom/HandlerProxy} proxy HandlerProxy instance.
	     * @param {HTMLElement} painterRoot painter.root (not painter.getViewportRoot()).
	     */
	    var Handler = function(storage, painter, proxy, painterRoot) {
	        Eventful.call(this);
	
	        this.storage = storage;
	
	        this.painter = painter;
	
	        this.painterRoot = painterRoot;
	
	        proxy = proxy || new EmptyProxy();
	
	        /**
	         * Proxy of event. can be Dom, WebGLSurface, etc.
	         */
	        this.proxy = proxy;
	
	        // Attach handler
	        proxy.handler = this;
	
	        /**
	         * @private
	         * @type {boolean}
	         */
	        this._hovered;
	
	        /**
	         * @private
	         * @type {Date}
	         */
	        this._lastTouchMoment;
	
	        /**
	         * @private
	         * @type {number}
	         */
	        this._lastX;
	
	        /**
	         * @private
	         * @type {number}
	         */
	        this._lastY;
	
	
	        Draggable.call(this);
	
	        util.each(handlerNames, function (name) {
	            proxy.on && proxy.on(name, this[name], this);
	        }, this);
	    };
	
	    Handler.prototype = {
	
	        constructor: Handler,
	
	        mousemove: function (event) {
	            var x = event.zrX;
	            var y = event.zrY;
	
	            var hovered = this.findHover(x, y, null);
	            var lastHovered = this._hovered;
	            var proxy = this.proxy;
	
	            this._hovered = hovered;
	
	            proxy.setCursor && proxy.setCursor(hovered ? hovered.cursor : 'default');
	
	            // Mouse out on previous hovered element
	            if (lastHovered && hovered !== lastHovered && lastHovered.__zr) {
	                this.dispatchToElement(lastHovered, 'mouseout', event);
	            }
	
	            // Mouse moving on one element
	            this.dispatchToElement(hovered, 'mousemove', event);
	
	            // Mouse over on a new element
	            if (hovered && hovered !== lastHovered) {
	                this.dispatchToElement(hovered, 'mouseover', event);
	            }
	        },
	
	        mouseout: function (event) {
	            this.dispatchToElement(this._hovered, 'mouseout', event);
	
	            // There might be some doms created by upper layer application
	            // at the same level of painter.getViewportRoot() (e.g., tooltip
	            // dom created by echarts), where 'globalout' event should not
	            // be triggered when mouse enters these doms. (But 'mouseout'
	            // should be triggered at the original hovered element as usual).
	            var element = event.toElement || event.relatedTarget;
	            var innerDom;
	            do {
	                element = element && element.parentNode;
	            }
	            while (element && element.nodeType != 9 && !(
	                innerDom = element === this.painterRoot
	            ));
	
	            !innerDom && this.trigger('globalout', {event: event});
	        },
	
	        /**
	         * Dispatch event
	         * @param {string} eventName
	         * @param {event=} eventArgs
	         */
	        dispatch: function (eventName, eventArgs) {
	            var handler = this[eventName];
	            handler && handler.call(this, eventArgs);
	        },
	
	        /**
	         * Dispose
	         */
	        dispose: function () {
	
	            this.proxy.dispose();
	
	            this.storage =
	            this.proxy =
	            this.painter = null;
	        },
	
	      
	        /**
	         * 事件分发代理
	         *
	         * @private
	         * @param {Object} targetEl 目标图形元素
	         * @param {string} eventName 事件名称
	         * @param {Object} event 事件对象
	         */
	        dispatchToElement: function (targetEl, eventName, event) {
	            var eventHandler = 'on' + eventName;
	            var eventPacket = makeEventPacket(eventName, targetEl, event);
	
	            var el = targetEl;
	
	            while (el) {
	                el[eventHandler]
	                    && (eventPacket.cancelBubble = el[eventHandler].call(el, eventPacket));
	
	                el.trigger(eventName, eventPacket);
	
	                el = el.parent;
	
	                if (eventPacket.cancelBubble) {
	                    break;
	                }
	            }
	
	            if (!eventPacket.cancelBubble) {
	                // 冒泡到顶级 zrender 对象
	                this.trigger(eventName, eventPacket);
	                // 分发事件到用户自定义层
	                // 用户有可能在全局 click 事件中 dispose，所以需要判断下 painter 是否存在
	                this.painter && this.painter.eachOtherLayer(function (layer) {
	                    if (typeof(layer[eventHandler]) == 'function') {
	                        layer[eventHandler].call(layer, eventPacket);
	                    }
	                    if (layer.trigger) {
	                        layer.trigger(eventName, eventPacket);
	                    }
	                });
	            }
	        },
	
	        /**
	         * @private
	         * @param {number} x
	         * @param {number} y
	         * @param {module:zrender/graphic/Displayable} exclude
	         * @method
	         */
	        findHover: function(x, y, exclude) {
	            var list = this.storage.getDisplayList();
	            for (var i = list.length - 1; i >= 0 ; i--) {
	                if (!list[i].silent
	                 && list[i] !== exclude
	                 // getDisplayList may include ignored item in VML mode
	                 && !list[i].ignore
	                 && isHover(list[i], x, y)) {
	                    return list[i];
	                }
	            }
	        }
	    };
	
	    // Common handlers
	    util.each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
	        Handler.prototype[name] = function (event) {
	            // Find hover again to avoid click event is dispatched manually. Or click is triggered without mouseover
	            var hovered = this.findHover(event.zrX, event.zrY, null);
	
	            if (name === 'mousedown') {
	                this._downel = hovered;
	                // In case click triggered before mouseup
	                this._upel = hovered;
	            }
	            else if (name === 'mosueup') {
	                this._upel = hovered;
	            }
	            else if (name === 'click') {
	                if (this._downel !== this._upel) {
	                    return;
	                }
	            }
	
	            this.dispatchToElement(hovered, name, event);
	        };
	    });
	
	    function isHover(displayable, x, y) {
	        if (displayable[displayable.rectHover ? 'rectContain' : 'contain'](x, y)) {
	            var el = displayable;
	            while (el) {
	                // If ancestor is silent or clipped by ancestor
	                if (el.silent || (el.clipPath && !el.clipPath.contain(x, y)))  {
	                    return false;
	                }
	                el = el.parent;
	            }
	            return true;
	        }
	
	        return false;
	    }
	
	    util.mixin(Handler, Eventful);
	    util.mixin(Handler, Draggable);
	
	    module.exports = Handler;


/***/ },
/* 63 */
/***/ function(module, exports) {

	// TODO Draggable for group
	// FIXME Draggable on element which has parent rotation or scale
	
	    function Draggable() {
	
	        this.on('mousedown', this._dragStart, this);
	        this.on('mousemove', this._drag, this);
	        this.on('mouseup', this._dragEnd, this);
	        this.on('globalout', this._dragEnd, this);
	        // this._dropTarget = null;
	        // this._draggingTarget = null;
	
	        // this._x = 0;
	        // this._y = 0;
	    }
	
	    Draggable.prototype = {
	
	        constructor: Draggable,
	
	        _dragStart: function (e) {
	            var draggingTarget = e.target;
	            if (draggingTarget && draggingTarget.draggable) {
	                this._draggingTarget = draggingTarget;
	                draggingTarget.dragging = true;
	                this._x = e.offsetX;
	                this._y = e.offsetY;
	
	                this.dispatchToElement(draggingTarget, 'dragstart', e.event);
	            }
	        },
	
	        _drag: function (e) {
	            var draggingTarget = this._draggingTarget;
	            if (draggingTarget) {
	
	                var x = e.offsetX;
	                var y = e.offsetY;
	
	                var dx = x - this._x;
	                var dy = y - this._y;
	                this._x = x;
	                this._y = y;
	
	                draggingTarget.drift(dx, dy, e);
	                this.dispatchToElement(draggingTarget, 'drag', e.event);
	
	                var dropTarget = this.findHover(x, y, draggingTarget);
	                var lastDropTarget = this._dropTarget;
	                this._dropTarget = dropTarget;
	
	                if (draggingTarget !== dropTarget) {
	                    if (lastDropTarget && dropTarget !== lastDropTarget) {
	                        this.dispatchToElement(lastDropTarget, 'dragleave', e.event);
	                    }
	                    if (dropTarget && dropTarget !== lastDropTarget) {
	                        this.dispatchToElement(dropTarget, 'dragenter', e.event);
	                    }
	                }
	            }
	        },
	
	        _dragEnd: function (e) {
	            var draggingTarget = this._draggingTarget;
	
	            if (draggingTarget) {
	                draggingTarget.dragging = false;
	            }
	
	            this.dispatchToElement(draggingTarget, 'dragend', e.event);
	
	            if (this._dropTarget) {
	                this.dispatchToElement(this._dropTarget, 'drop', e.event);
	            }
	
	            this._draggingTarget = null;
	            this._dropTarget = null;
	        }
	
	    };
	
	    module.exports = Draggable;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(5);
	var Group = __webpack_require__(4);
	
	// Use timsort because in most case elements are partially sorted
	// https://jsfiddle.net/pissang/jr4x7mdm/8/
	var timsort = __webpack_require__(65);
	
	function shapeCompareFunc(a, b) {
	    if (a.zlevel === b.zlevel) {
	        if (a.z === b.z) {
	            // if (a.z2 === b.z2) {
	            //     // FIXME Slow has renderidx compare
	            //     // http://stackoverflow.com/questions/20883421/sorting-in-javascript-should-every-compare-function-have-a-return-0-statement
	            //     // https://github.com/v8/v8/blob/47cce544a31ed5577ffe2963f67acb4144ee0232/src/js/array.js#L1012
	            //     return a.__renderidx - b.__renderidx;
	            // }
	            return a.z2 - b.z2;
	        }
	        return a.z - b.z;
	    }
	    return a.zlevel - b.zlevel;
	}
	/**
	 * 内容仓库 (M)
	 * @alias module:zrender/Storage
	 * @constructor
	 */
	var Storage = function () {
	    // 所有常规形状，id索引的map
	    this._elements = {};
	
	    this._roots = [];
	
	    this._displayList = [];
	
	    this._displayListLen = 0;
	};
	
	Storage.prototype = {
	
	    constructor: Storage,
	
	    /**
	     * @param  {Function} cb
	     *
	     */
	    traverse: function (cb, context) {
	        for (var i = 0; i < this._roots.length; i++) {
	            this._roots[i].traverse(cb, context);
	        }
	    },
	
	    /**
	     * 返回所有图形的绘制队列
	     * @param {boolean} [update=false] 是否在返回前更新该数组
	     * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组, 在 update 为 true 的时候有效
	     *
	     * 详见{@link module:zrender/graphic/Displayable.prototype.updateDisplayList}
	     * @return {Array.<module:zrender/graphic/Displayable>}
	     */
	    getDisplayList: function (update, includeIgnore) {
	        includeIgnore = includeIgnore || false;
	        if (update) {
	            this.updateDisplayList(includeIgnore);
	        }
	        return this._displayList;
	    },
	
	    /**
	     * 更新图形的绘制队列。
	     * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
	     * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
	     * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组
	     */
	    updateDisplayList: function (includeIgnore) {
	        this._displayListLen = 0;
	        var roots = this._roots;
	        var displayList = this._displayList;
	        for (var i = 0, len = roots.length; i < len; i++) {
	            this._updateAndAddDisplayable(roots[i], null, includeIgnore);
	        }
	        displayList.length = this._displayListLen;
	
	        // for (var i = 0, len = displayList.length; i < len; i++) {
	        //     displayList[i].__renderidx = i;
	        // }
	
	        // displayList.sort(shapeCompareFunc);
	        false && timsort(displayList, shapeCompareFunc);
	    },
	
	    _updateAndAddDisplayable: function (el, clipPaths, includeIgnore) {
	
	        if (el.ignore && !includeIgnore) {
	            return;
	        }
	
	        el.beforeUpdate();
	
	        if (el.__dirty) {
	
	            el.update();
	
	        }
	
	        el.afterUpdate();
	
	        /*** we
	        var clipPath = el.clipPath;
	        if (clipPath) {
	            // clipPath 的变换是基于 group 的变换
	            clipPath.parent = el;
	            clipPath.updateTransform();
	
	            // FIXME 效率影响
	            if (clipPaths) {
	                clipPaths = clipPaths.slice();
	                clipPaths.push(clipPath);
	            }
	            else {
	                clipPaths = [clipPath];
	            }
	        }
	        we ***/
	
	        /*** we ***/
	        var userSetClipPath = el.clipPath;
	        if (userSetClipPath) {
	
	            // FIXME 效率影响
	            if (clipPaths) {
	                clipPaths = clipPaths.slice();
	            }
	            else {
	                clipPaths = [];
	            }
	
	            var currentClipPath = userSetClipPath;
	            var parentClipPath = el;
	            // Recursively add clip path
	            while (currentClipPath) {
	                // clipPath 的变换是基于使用这个 clipPath 的元素
	                currentClipPath.parent = parentClipPath;
	                currentClipPath.updateTransform();
	
	                clipPaths.push(currentClipPath);
	
	                parentClipPath = currentClipPath;
	                currentClipPath = currentClipPath.clipPath;
	            }
	        }
	        /*** we ***/
	
	        if (el.isGroup) {
	            var children = el._children;
	
	            for (var i = 0; i < children.length; i++) {
	                var child = children[i];
	
	                // Force to mark as dirty if group is dirty
	                // FIXME __dirtyPath ?
	                if (el.__dirty) {
	                    child.__dirty = true;
	                }
	
	                this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
	            }
	
	            // Mark group clean here
	            el.__dirty = false;
	
	        }
	        else {
	            el.__clipPaths = clipPaths;
	
	            this._displayList[this._displayListLen++] = el;
	        }
	    },
	
	    /**
	     * 添加图形(Shape)或者组(Group)到根节点
	     * @param {module:zrender/Element} el
	     */
	    addRoot: function (el) {
	        // Element has been added
	        if (this._elements[el.id]) {
	            return;
	        }
	
	        if (el instanceof Group) {
	            el.addChildrenToStorage(this);
	        }
	
	        this.addToMap(el);
	        this._roots.push(el);
	    },
	
	    /**
	     * 删除指定的图形(Shape)或者组(Group)
	     * @param {string|Array.<string>} [elId] 如果为空清空整个Storage
	     */
	    delRoot: function (elId) {
	        if (elId == null) {
	            // 不指定elId清空
	            for (var i = 0; i < this._roots.length; i++) {
	                var root = this._roots[i];
	                if (root instanceof Group) {
	                    root.delChildrenFromStorage(this);
	                }
	            }
	
	            this._elements = {};
	            this._roots = [];
	            this._displayList = [];
	            this._displayListLen = 0;
	
	            return;
	        }
	
	        if (elId instanceof Array) {
	            for (var i = 0, l = elId.length; i < l; i++) {
	                this.delRoot(elId[i]);
	            }
	            return;
	        }
	
	        var el;
	        if (typeof (elId) == 'string') {
	            el = this._elements[elId];
	        }
	        else {
	            el = elId;
	        }
	
	        var idx = util.indexOf(this._roots, el);
	        if (idx >= 0) {
	            this.delFromMap(el.id);
	            this._roots.splice(idx, 1);
	            if (el instanceof Group) {
	                el.delChildrenFromStorage(this);
	            }
	        }
	    },
	
	    addToMap: function (el) {
	        if (el instanceof Group) {
	            el.__storage = this;
	        }
	        el.dirty(false);
	
	        this._elements[el.id] = el;
	
	        return this;
	    },
	
	    get: function (elId) {
	        return this._elements[elId];
	    },
	
	    delFromMap: function (elId) {
	        var elements = this._elements;
	        var el = elements[elId];
	        if (el) {
	            delete elements[elId];
	            if (el instanceof Group) {
	                el.__storage = null;
	            }
	        }
	
	        return this;
	    },
	
	    /**
	     * 清空并且释放Storage
	     */
	    dispose: function () {
	        this._elements =
	            this._renderList =
	            this._roots = null;
	    },
	
	    displayableSortFunc: shapeCompareFunc
	};
	
	module.exports = Storage;
	


/***/ },
/* 65 */
/***/ function(module, exports) {

	// https://github.com/mziccard/node-timsort
	
	    var DEFAULT_MIN_MERGE = 32;
	
	    var DEFAULT_MIN_GALLOPING = 7;
	
	    var DEFAULT_TMP_STORAGE_LENGTH = 256;
	
	    function minRunLength(n) {
	        var r = 0;
	
	        while (n >= DEFAULT_MIN_MERGE) {
	            r |= n & 1;
	            n >>= 1;
	        }
	
	        return n + r;
	    }
	
	    function makeAscendingRun(array, lo, hi, compare) {
	        var runHi = lo + 1;
	
	        if (runHi === hi) {
	            return 1;
	        }
	
	        if (compare(array[runHi++], array[lo]) < 0) {
	            while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
	                runHi++;
	            }
	
	            reverseRun(array, lo, runHi);
	        }
	        else {
	            while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
	                runHi++;
	            }
	        }
	
	        return runHi - lo;
	    }
	
	    function reverseRun(array, lo, hi) {
	        hi--;
	
	        while (lo < hi) {
	            var t = array[lo];
	            array[lo++] = array[hi];
	            array[hi--] = t;
	        }
	    }
	
	    function binaryInsertionSort(array, lo, hi, start, compare) {
	        if (start === lo) {
	            start++;
	        }
	
	        for (; start < hi; start++) {
	            var pivot = array[start];
	
	            var left = lo;
	            var right = start;
	            var mid;
	
	            while (left < right) {
	                mid = left + right >>> 1;
	
	                if (compare(pivot, array[mid]) < 0) {
	                    right = mid;
	                }
	                else {
	                    left = mid + 1;
	                }
	            }
	
	            var n = start - left;
	
	            switch (n) {
	                case 3:
	                    array[left + 3] = array[left + 2];
	
	                case 2:
	                    array[left + 2] = array[left + 1];
	
	                case 1:
	                    array[left + 1] = array[left];
	                    break;
	                default:
	                    while (n > 0) {
	                        array[left + n] = array[left + n - 1];
	                        n--;
	                    }
	            }
	
	            array[left] = pivot;
	        }
	    }
	
	    function gallopLeft(value, array, start, length, hint, compare) {
	        var lastOffset = 0;
	        var maxOffset = 0;
	        var offset = 1;
	
	        if (compare(value, array[start + hint]) > 0) {
	            maxOffset = length - hint;
	
	            while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
	                lastOffset = offset;
	                offset = (offset << 1) + 1;
	
	                if (offset <= 0) {
	                    offset = maxOffset;
	                }
	            }
	
	            if (offset > maxOffset) {
	                offset = maxOffset;
	            }
	
	            lastOffset += hint;
	            offset += hint;
	        }
	        else {
	            maxOffset = hint + 1;
	            while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
	                lastOffset = offset;
	                offset = (offset << 1) + 1;
	
	                if (offset <= 0) {
	                    offset = maxOffset;
	                }
	            }
	            if (offset > maxOffset) {
	                offset = maxOffset;
	            }
	
	            var tmp = lastOffset;
	            lastOffset = hint - offset;
	            offset = hint - tmp;
	        }
	
	        lastOffset++;
	        while (lastOffset < offset) {
	            var m = lastOffset + (offset - lastOffset >>> 1);
	
	            if (compare(value, array[start + m]) > 0) {
	                lastOffset = m + 1;
	            }
	            else {
	                offset = m;
	            }
	        }
	        return offset;
	    }
	
	    function gallopRight(value, array, start, length, hint, compare) {
	        var lastOffset = 0;
	        var maxOffset = 0;
	        var offset = 1;
	
	        if (compare(value, array[start + hint]) < 0) {
	            maxOffset = hint + 1;
	
	            while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
	                lastOffset = offset;
	                offset = (offset << 1) + 1;
	
	                if (offset <= 0) {
	                    offset = maxOffset;
	                }
	            }
	
	            if (offset > maxOffset) {
	                offset = maxOffset;
	            }
	
	            var tmp = lastOffset;
	            lastOffset = hint - offset;
	            offset = hint - tmp;
	        }
	        else {
	            maxOffset = length - hint;
	
	            while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
	                lastOffset = offset;
	                offset = (offset << 1) + 1;
	
	                if (offset <= 0) {
	                    offset = maxOffset;
	                }
	            }
	
	            if (offset > maxOffset) {
	                offset = maxOffset;
	            }
	
	            lastOffset += hint;
	            offset += hint;
	        }
	
	        lastOffset++;
	
	        while (lastOffset < offset) {
	            var m = lastOffset + (offset - lastOffset >>> 1);
	
	            if (compare(value, array[start + m]) < 0) {
	                offset = m;
	            }
	            else {
	                lastOffset = m + 1;
	            }
	        }
	
	        return offset;
	    }
	
	    function TimSort(array, compare) {
	        var minGallop = DEFAULT_MIN_GALLOPING;
	        var length = 0;
	        var tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
	        var stackLength = 0;
	        var runStart;
	        var runLength;
	        var stackSize = 0;
	
	        length = array.length;
	
	        if (length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
	            tmpStorageLength = length >>> 1;
	        }
	
	        var tmp = [];
	
	        stackLength = length < 120 ? 5 : length < 1542 ? 10 : length < 119151 ? 19 : 40;
	
	        runStart = [];
	        runLength = [];
	
	        function pushRun(_runStart, _runLength) {
	            runStart[stackSize] = _runStart;
	            runLength[stackSize] = _runLength;
	            stackSize += 1;
	        }
	
	        function mergeRuns() {
	            while (stackSize > 1) {
	                var n = stackSize - 2;
	
	                if (n >= 1 && runLength[n - 1] <= runLength[n] + runLength[n + 1] || n >= 2 && runLength[n - 2] <= runLength[n] + runLength[n - 1]) {
	                    if (runLength[n - 1] < runLength[n + 1]) {
	                        n--;
	                    }
	                }
	                else if (runLength[n] > runLength[n + 1]) {
	                    break;
	                }
	                mergeAt(n);
	            }
	        }
	
	        function forceMergeRuns() {
	            while (stackSize > 1) {
	                var n = stackSize - 2;
	
	                if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
	                    n--;
	                }
	
	                mergeAt(n);
	            }
	        }
	
	        function mergeAt(i) {
	            var start1 = runStart[i];
	            var length1 = runLength[i];
	            var start2 = runStart[i + 1];
	            var length2 = runLength[i + 1];
	
	            runLength[i] = length1 + length2;
	
	            if (i === stackSize - 3) {
	                runStart[i + 1] = runStart[i + 2];
	                runLength[i + 1] = runLength[i + 2];
	            }
	
	            stackSize--;
	
	            var k = gallopRight(array[start2], array, start1, length1, 0, compare);
	            start1 += k;
	            length1 -= k;
	
	            if (length1 === 0) {
	                return;
	            }
	
	            length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
	
	            if (length2 === 0) {
	                return;
	            }
	
	            if (length1 <= length2) {
	                mergeLow(start1, length1, start2, length2);
	            }
	            else {
	                mergeHigh(start1, length1, start2, length2);
	            }
	        }
	
	        function mergeLow(start1, length1, start2, length2) {
	            var i = 0;
	
	            for (i = 0; i < length1; i++) {
	                tmp[i] = array[start1 + i];
	            }
	
	            var cursor1 = 0;
	            var cursor2 = start2;
	            var dest = start1;
	
	            array[dest++] = array[cursor2++];
	
	            if (--length2 === 0) {
	                for (i = 0; i < length1; i++) {
	                    array[dest + i] = tmp[cursor1 + i];
	                }
	                return;
	            }
	
	            if (length1 === 1) {
	                for (i = 0; i < length2; i++) {
	                    array[dest + i] = array[cursor2 + i];
	                }
	                array[dest + length2] = tmp[cursor1];
	                return;
	            }
	
	            var _minGallop = minGallop;
	            var count1, count2, exit;
	
	            while (1) {
	                count1 = 0;
	                count2 = 0;
	                exit = false;
	
	                do {
	                    if (compare(array[cursor2], tmp[cursor1]) < 0) {
	                        array[dest++] = array[cursor2++];
	                        count2++;
	                        count1 = 0;
	
	                        if (--length2 === 0) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                    else {
	                        array[dest++] = tmp[cursor1++];
	                        count1++;
	                        count2 = 0;
	                        if (--length1 === 1) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                } while ((count1 | count2) < _minGallop);
	
	                if (exit) {
	                    break;
	                }
	
	                do {
	                    count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
	
	                    if (count1 !== 0) {
	                        for (i = 0; i < count1; i++) {
	                            array[dest + i] = tmp[cursor1 + i];
	                        }
	
	                        dest += count1;
	                        cursor1 += count1;
	                        length1 -= count1;
	                        if (length1 <= 1) {
	                            exit = true;
	                            break;
	                        }
	                    }
	
	                    array[dest++] = array[cursor2++];
	
	                    if (--length2 === 0) {
	                        exit = true;
	                        break;
	                    }
	
	                    count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
	
	                    if (count2 !== 0) {
	                        for (i = 0; i < count2; i++) {
	                            array[dest + i] = array[cursor2 + i];
	                        }
	
	                        dest += count2;
	                        cursor2 += count2;
	                        length2 -= count2;
	
	                        if (length2 === 0) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                    array[dest++] = tmp[cursor1++];
	
	                    if (--length1 === 1) {
	                        exit = true;
	                        break;
	                    }
	
	                    _minGallop--;
	                } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
	
	                if (exit) {
	                    break;
	                }
	
	                if (_minGallop < 0) {
	                    _minGallop = 0;
	                }
	
	                _minGallop += 2;
	            }
	
	            minGallop = _minGallop;
	
	            minGallop < 1 && (minGallop = 1);
	
	            if (length1 === 1) {
	                for (i = 0; i < length2; i++) {
	                    array[dest + i] = array[cursor2 + i];
	                }
	                array[dest + length2] = tmp[cursor1];
	            }
	            else if (length1 === 0) {
	                throw new Error();
	                // throw new Error('mergeLow preconditions were not respected');
	            }
	            else {
	                for (i = 0; i < length1; i++) {
	                    array[dest + i] = tmp[cursor1 + i];
	                }
	            }
	        }
	
	        function mergeHigh (start1, length1, start2, length2) {
	            var i = 0;
	
	            for (i = 0; i < length2; i++) {
	                tmp[i] = array[start2 + i];
	            }
	
	            var cursor1 = start1 + length1 - 1;
	            var cursor2 = length2 - 1;
	            var dest = start2 + length2 - 1;
	            var customCursor = 0;
	            var customDest = 0;
	
	            array[dest--] = array[cursor1--];
	
	            if (--length1 === 0) {
	                customCursor = dest - (length2 - 1);
	
	                for (i = 0; i < length2; i++) {
	                    array[customCursor + i] = tmp[i];
	                }
	
	                return;
	            }
	
	            if (length2 === 1) {
	                dest -= length1;
	                cursor1 -= length1;
	                customDest = dest + 1;
	                customCursor = cursor1 + 1;
	
	                for (i = length1 - 1; i >= 0; i--) {
	                    array[customDest + i] = array[customCursor + i];
	                }
	
	                array[dest] = tmp[cursor2];
	                return;
	            }
	
	            var _minGallop = minGallop;
	
	            while (true) {
	                var count1 = 0;
	                var count2 = 0;
	                var exit = false;
	
	                do {
	                    if (compare(tmp[cursor2], array[cursor1]) < 0) {
	                        array[dest--] = array[cursor1--];
	                        count1++;
	                        count2 = 0;
	                        if (--length1 === 0) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                    else {
	                        array[dest--] = tmp[cursor2--];
	                        count2++;
	                        count1 = 0;
	                        if (--length2 === 1) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                } while ((count1 | count2) < _minGallop);
	
	                if (exit) {
	                    break;
	                }
	
	                do {
	                    count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
	
	                    if (count1 !== 0) {
	                        dest -= count1;
	                        cursor1 -= count1;
	                        length1 -= count1;
	                        customDest = dest + 1;
	                        customCursor = cursor1 + 1;
	
	                        for (i = count1 - 1; i >= 0; i--) {
	                            array[customDest + i] = array[customCursor + i];
	                        }
	
	                        if (length1 === 0) {
	                            exit = true;
	                            break;
	                        }
	                    }
	
	                    array[dest--] = tmp[cursor2--];
	
	                    if (--length2 === 1) {
	                        exit = true;
	                        break;
	                    }
	
	                    count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
	
	                    if (count2 !== 0) {
	                        dest -= count2;
	                        cursor2 -= count2;
	                        length2 -= count2;
	                        customDest = dest + 1;
	                        customCursor = cursor2 + 1;
	
	                        for (i = 0; i < count2; i++) {
	                            array[customDest + i] = tmp[customCursor + i];
	                        }
	
	                        if (length2 <= 1) {
	                            exit = true;
	                            break;
	                        }
	                    }
	
	                    array[dest--] = array[cursor1--];
	
	                    if (--length1 === 0) {
	                        exit = true;
	                        break;
	                    }
	
	                    _minGallop--;
	                } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
	
	                if (exit) {
	                    break;
	                }
	
	                if (_minGallop < 0) {
	                    _minGallop = 0;
	                }
	
	                _minGallop += 2;
	            }
	
	            minGallop = _minGallop;
	
	            if (minGallop < 1) {
	                minGallop = 1;
	            }
	
	            if (length2 === 1) {
	                dest -= length1;
	                cursor1 -= length1;
	                customDest = dest + 1;
	                customCursor = cursor1 + 1;
	
	                for (i = length1 - 1; i >= 0; i--) {
	                    array[customDest + i] = array[customCursor + i];
	                }
	
	                array[dest] = tmp[cursor2];
	            }
	            else if (length2 === 0) {
	                throw new Error();
	                // throw new Error('mergeHigh preconditions were not respected');
	            }
	            else {
	                customCursor = dest - (length2 - 1);
	                for (i = 0; i < length2; i++) {
	                    array[customCursor + i] = tmp[i];
	                }
	            }
	        }
	
	        this.mergeRuns = mergeRuns;
	        this.forceMergeRuns = forceMergeRuns;
	        this.pushRun = pushRun;
	    }
	
	    function sort(array, compare, lo, hi) {
	        if (!lo) {
	            lo = 0;
	        }
	        if (!hi) {
	            hi = array.length;
	        }
	
	        var remaining = hi - lo;
	
	        if (remaining < 2) {
	            return;
	        }
	
	        var runLength = 0;
	
	        if (remaining < DEFAULT_MIN_MERGE) {
	            runLength = makeAscendingRun(array, lo, hi, compare);
	            binaryInsertionSort(array, lo, hi, lo + runLength, compare);
	            return;
	        }
	
	        var ts = new TimSort(array, compare);
	
	        var minRun = minRunLength(remaining);
	
	        do {
	            runLength = makeAscendingRun(array, lo, hi, compare);
	            if (runLength < minRun) {
	                var force = remaining;
	                if (force > minRun) {
	                    force = minRun;
	                }
	
	                binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
	                runLength = force;
	            }
	
	            ts.pushRun(lo, runLength);
	            ts.mergeRuns();
	
	            remaining -= runLength;
	            lo += runLength;
	        } while (remaining !== 0);
	
	        ts.forceMergeRuns();
	    }
	
	    module.exports = sort;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(17);
	var util = __webpack_require__(5);
	var log = __webpack_require__(16);
	var BoundingRect = __webpack_require__(18);
	var timsort = __webpack_require__(65);
	var Layer = __webpack_require__(67);
	
	function parseInt10(val) {
	    return parseInt(val, 10);
	}
	
	var tmpRect = new BoundingRect(0, 0, 0, 0);
	var viewRect = new BoundingRect(0, 0, 0, 0);
	
	function isDisplayableCulled(el, width, height) {
	    tmpRect.copy(el.getBoundingRect());
	    if (el.transform) {
	        tmpRect.applyTransform(el.transform);
	    }
	    viewRect.width = width;
	    viewRect.height = height;
	    return !tmpRect.intersect(viewRect);
	}
	
	function isClipPathChanged(clipPaths, prevClipPaths) {
	    if (clipPaths == prevClipPaths) { // Can both be null or undefined
	        return false;
	    }
	
	    if (!clipPaths || !prevClipPaths || (clipPaths.length !== prevClipPaths.length)) {
	        return true;
	    }
	    for (var i = 0; i < clipPaths.length; i++) {
	        if (clipPaths[i] !== prevClipPaths[i]) {
	            return true;
	        }
	    }
	}
	
	function doClip(clipPaths, ctx) {
		/*** we
	    for (var i = 0; i < clipPaths.length; i++) {
	        var clipPath = clipPaths[i];
	        var path = clipPath.path;
	
	        clipPath.setTransform(ctx);
	        path.beginPath(ctx);
	        clipPath.buildPath(path, clipPath.shape);
	        ctx.clip();
	        // Transform back
	        clipPath.restoreTransform(ctx);
	    }
		we ***/
	}
	
	/**
	 * @alias module:zrender/Painter
	 * @constructor
	 * @param {Object} root 绘图容器
	 * @param {module:zrender/Storage} storage
	 * @param {Ojbect} opts
	 */
	var Painter = function (root, storage, opts) {
	
	
	    this._opts = opts = util.extend({}, opts || {});
	
	    /**
	     * @type {number}
	     */
	    this.dpr = opts.devicePixelRatio || config.devicePixelRatio;
	
	    /**
	     * 绘图容器
	     * @type {Object}
	     */
	    this.root = root;
	
	    /**
	     * @type {module:zrender/Storage}
	     */
	    this.storage = storage;
	
	    /**
	     * @type {Array.<number>}
	     * @private
	     */
	    var zlevelList = this._zlevelList = [];
	
	    /**
	     * @type {Object.<string, module:zrender/Layer>}
	     * @private
	     */
	    var layers = this._layers = {};
	
	    /**
	     * @type {Object.<string, Object>}
	     * @type {private}
	     */
	    this._layerConfig = {};
	
	
	    // Use canvas width and height directly
	    var width = root.width;
	    var height = root.height;
	    this._width = width;
	    this._height = height;
	
	    // Create layer if only one given canvas
	    // Device pixel ratio is fixed to 1 because given canvas has its specified width and height
	    var mainLayer = new Layer(root, this, 1);
	    mainLayer.initContext();
	    // FIXME Use canvas width and height
	    // mainLayer.resize(width, height);
	    layers[0] = mainLayer;
	    zlevelList.push(0);
	
	};
	
	Painter.prototype = {
	
	    constructor: Painter,
	
	    /**
	     * @return {HTMLDivElement}
	     */
	    getViewportRoot: function () {
	        return this._layers[0].dom;
	    },
	
	    /**
	     * 刷新
	     * @param {boolean} [paintAll=false] 强制绘制所有displayable
	     */
	    refresh: function (paintAll) {
			
	        var list = this.storage.getDisplayList(true);	
			
	        this._paintList(list, paintAll);       
	
	        return this;
	    },
	
	
	    _paintList: function (list, paintAll) {
	
	        if (paintAll == null) {
	            paintAll = false;
	        }
	
	        this._doPaintList(list, paintAll);
	    },
	
	    _doPaintList: function (list, paintAll) {
			
	        var currentLayer;
	        var currentZLevel;
	        var ctx;
	
	        // var invTransform = [];
	        var scope;
	
	        var width = this._width;
	        var height = this._height;
	
	        for (var i = 0, l = list.length; i < l; i++) {
	            var el = list[i];
	            var elZLevel = 0;
	
	            var elFrame = el.__frame;
	
	            // Change draw layer
	            if (currentZLevel !== elZLevel) {
	                if (ctx) {
	                    ctx.restore();
	                }
	
	                // Reset scope
	                scope = {};
	
	                // Only 0 zlevel if only has one canvas
	                currentZLevel = elZLevel;
	                currentLayer = this.getLayer(currentZLevel);
	
	                ctx = currentLayer.ctx;
	                ctx.save();
	
	                // Reset the count
	                currentLayer.__unusedCount = 0;
	
	                if (currentLayer.__dirty || paintAll) {
	                    currentLayer.clear();
	                }
	            }
	
	            if (!(currentLayer.__dirty || paintAll)) {
	                continue;
	            }
	
	            if (elFrame >= 0) {
	
	            }
	            else {
	                this._doPaintEl(el, currentLayer, paintAll, scope);
	            }
	
	            el.__dirty = false;
	        }
	
	        // Restore the lastLayer ctx
	        ctx && ctx.restore();
	        // If still has clipping state
	        // if (scope.prevElClipPaths) {
	        //     ctx.restore();
	        // }        
	    },
	
	    _doPaintEl: function (el, currentLayer, forcePaint, scope) {
			
	        var ctx = currentLayer.ctx;
	        var m = el.transform;
	        if (
	            (currentLayer.__dirty || forcePaint)
	            // Ignore invisible element
	            && !el.invisible
	            // Ignore transparent element
	            && el.style.opacity !== 0
	            // Ignore scale 0 element, in some environment like node-canvas
	            // Draw a scale 0 element can cause all following draw wrong
	            // And setTransform with scale 0 will cause set back transform failed.
	            && !(m && !m[0] && !m[3])
	            // Ignore culled element
	            && !(el.culling && isDisplayableCulled(el, this._width, this._height))
	        ) {
	
	            var clipPaths = el.__clipPaths;
	
	            // Optimize when clipping on group with several elements
	            if (scope.prevClipLayer !== currentLayer
	                || isClipPathChanged(clipPaths, scope.prevElClipPaths)
	            ) {
	                // If has previous clipping state, restore from it
	                if (scope.prevElClipPaths) {
	                    scope.prevClipLayer.ctx.restore();
	                    scope.prevClipLayer = scope.prevElClipPaths = null;
	
	                    // Reset prevEl since context has been restored
	                    scope.prevEl = null;
	                }
	                // New clipping state
	                if (clipPaths) {
	                    ctx.save();
	                    doClip(clipPaths, ctx);
	                    scope.prevClipLayer = currentLayer;
	                    scope.prevElClipPaths = clipPaths;
	                }
	            }
	            el.beforeBrush && el.beforeBrush(ctx);
	
	            el.brush(ctx, scope.prevEl || null);
	            scope.prevEl = el;
	
				
	            /*** we ***/
	            ctx.draw(true);
	            /*** we ***/
	
	            el.afterBrush && el.afterBrush(ctx);
	        }
	    },
	
	    /**
	     * 获取 zlevel 所在层，如果不存在则会创建一个新的层
	     * @param {number} zlevel
	     * @return {module:zrender/Layer}
	     */
	    getLayer: function (zlevel) {
	        return this._layers[0];
	    },
	
	    // Iterate each layer
	    eachLayer: function (cb, context) {
	        var zlevelList = this._zlevelList;
	        var z;
	        var i;
	        for (i = 0; i < zlevelList.length; i++) {
	            z = zlevelList[i];
	            cb.call(context, this._layers[z], z);
	        }
	    },
	
	    // Iterate each buildin layer
	    eachBuildinLayer: function (cb, context) {
	        var zlevelList = this._zlevelList;
	        var layer;
	        var z;
	        var i;
	        for (i = 0; i < zlevelList.length; i++) {
	            z = zlevelList[i];
	            layer = this._layers[z];
	            if (layer.isBuildin) {
	                cb.call(context, layer, z);
	            }
	        }
	    },
	
	    // Iterate each other layer except buildin layer
	    eachOtherLayer: function (cb, context) {
	        var zlevelList = this._zlevelList;
	        var layer;
	        var z;
	        var i;
	        for (i = 0; i < zlevelList.length; i++) {
	            z = zlevelList[i];
	            layer = this._layers[z];
	            if (!layer.isBuildin) {
	                cb.call(context, layer, z);
	            }
	        }
	    },
	
	    /**
	     * 获取所有已创建的层
	     * @param {Array.<module:zrender/Layer>} [prevLayer]
	     */
	    getLayers: function () {
	        return this._layers;
	    },
	
	    /**
	     * 清除hover层外所有内容
	     */
	    clear: function () {
	        this.eachBuildinLayer(this._clearLayer);
	        return this;
	    },
	
	    _clearLayer: function (layer) {
	        layer.clear();
	    },
	
	 /**
	         * 修改指定zlevel的绘制参数
	         *
	         * @param {string} zlevel
	         * @param {Object} config 配置对象
	         * @param {string} [config.clearColor=0] 每次清空画布的颜色
	         * @param {string} [config.motionBlur=false] 是否开启动态模糊
	         * @param {number} [config.lastFrameAlpha=0.7]
	         *                 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
	         */
	        configLayer: function (zlevel, config) {
	            if (config) {
	                var layerConfig = this._layerConfig;
	                if (!layerConfig[zlevel]) {
	                    layerConfig[zlevel] = config;
	                }
	                else {
	                    util.merge(layerConfig[zlevel], config, true);
	                }
	
	                var layer = this._layers[zlevel];
	
	                if (layer) {
	                    util.merge(layer, layerConfig[zlevel], true);
	                }
	            }
	        },
	
	    /**
	     * 释放
	     */
	    dispose: function () {
	        this.root =
	            this.storage =
	
	            this._domRoot =
	            this._layers = null;
	    },
	
	
	    /**
	     * 获取绘图区域宽度
	     */
	    getWidth: function () {
	        return this._width;
	    },
	
	    /**
	     * 获取绘图区域高度
	     */
	    getHeight: function () {
	        return this._height;
	    }
	};
	
	module.exports = Painter;
	


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(5);
	var config = __webpack_require__(17);
	var Style = __webpack_require__(22);
	var Pattern = __webpack_require__(33);
	var log = __webpack_require__(16);
	
	/**
	 * @alias module:zrender/Layer
	 * @constructor
	 * @extends module:zrender/mixin/Transformable
	 * @param {Object} dom
	 * @param {module:zrender/Painter} painter
	 * @param {number} [dpr]
	 */
	var Layer = function (dom, painter, dpr) {
	
	    this.id = dom.id;
	    this.dom = dom;
	
	    this.ctxBack = null;
	
	    this.painter = painter;
	
	    this.config = null;
	
	    // Configs
	    /**
	     * 每次清空画布的颜色
	     * @type {string}
	     * @default 0
	     */
	    this.clearColor = 0;
	    /**
	     * 是否开启动态模糊
	     * @type {boolean}
	     * @default false
	     */
	    this.motionBlur = false;
	    /**
	     * 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
	     * @type {number}
	     * @default 0.7
	     */
	    this.lastFrameAlpha = 0.7;
	
	    /**
	     * Layer dpr
	     * @type {number}
	     */
	    this.dpr = dpr;
	};
	
	Layer.prototype = {
	
	    constructor: Layer,
	
	    elCount: 0,
	
	    __dirty: true,
	
	    initContext: function () {
	        this.ctx = this.dom.getContext('2d');
	
	        this.ctx.dpr = this.dpr;
	    },
	    
	    /**
	     * 清空该层画布
	     * @param {boolean} clearAll Clear all with out motion blur
	     */
	    clear: function (clearAll) {
	        var dom = this.dom;
	        var ctx = this.ctx;
	        var width = dom.width;
	        var height = dom.height;
	
	        var clearColor = this.clearColor;
	
	        var lastFrameAlpha = this.lastFrameAlpha;
	
	        var dpr = this.dpr;
	
	        ctx.clearRect(0, 0, width, height);
	        if (clearColor) {
	            var clearColorGradientOrPattern;
	            // Gradient
	            if (clearColor.colorStops) {
	                // Cache canvas gradient
	                clearColorGradientOrPattern = clearColor.__canvasGradient || Style.getGradient(ctx, clearColor, {
	                    x: 0,
	                    y: 0,
	                    width: width,
	                    height: height
	                });
	
	                clearColor.__canvasGradient = clearColorGradientOrPattern;
	            }
	            // Pattern
	            else if (clearColor.image) {
	                clearColorGradientOrPattern = Pattern.prototype.getCanvasPattern.call(clearColor, ctx);
	            }
	            ctx.save();
	            ctx.setFillStyle(clearColorGradientOrPattern || clearColor);
	            ctx.fillRect(0, 0, width, height);
	            ctx.restore();
	        }
	    }
	};
	
	module.exports = Layer;


/***/ }
/******/ ])));
//# sourceMappingURL=wezrender.js.map