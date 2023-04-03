 //limit
 let optionsButtons = document.querySelectorAll('.options Button');
 let previousShapeButton = null;
 var colors = [
     'red', 'green', 'blue', 'white',
     'orange', 'purple', 'cyan', 'yellow'
 ];

 optionsButtons.forEach((button) => {
     button.addEventListener('click', (e) => {
         if (e.target.classList.contains('shape-button')) {
             if (previousShapeButton) {
                 previousShapeButton.classList.toggle('button-active')
             }
             previousShapeButton = e.target
         }
         e.target.classList.toggle('button-active')
         if (e.target.classList.contains('dotted')) {

             solidMode = false
         }
     })
 })
 var H = 600,
     W = 600;
 var m_min_x = -1,
     m_max_x = 1;
 var m_min_y = -1,
     m_max_y = 1;
 var m_min_z = -1,
     m_max_z = 1;
 var stepD = 0.01 * (10) * 1.95 + 0.05;
 var dottedshape = '';
 var solidMode = false;

 var rotatex = false,
     rotatey = false,
     rotatez = false;
 var rotatexspeed = 50 * 0.01,
     rotateyspeed = 50 * 0.01,
     rotatezspeed = 50 * 0.01;
 var cameray = 0,
     camerax = 0;
 var mainDeepth = 4;
 var drawPointsMode = false;
 var drawedZ = 0;
 var dxDrawedZ = 0.1;
 var drawedColor = 'red';
 var DottedShapFunction = () => {};
 var C = document.getElementById('canvas') // as HTMLCanvasElement;
 var canvasOffsetX = C.offsetLeft;
 var canvasOffsetY = C.offsetTop;
 let drawDottedConstrcuter = `press z to increas the depth
 press x to decreas the depth
 `
 let drawSolidConstrcuter = `in progress 
 refresh page and try again
 `
 let constructure = document.getElementById('constrcture');

 C.addEventListener('mousedown', (e) => {
     if (drawPointsMode) {
         points.push([pushXClient(e), pushYClient(e), drawedZ, drawedColor])
     }
 })
 window.addEventListener('keydown', e => {
     if (
         e.key === 'z' && (drawedZ < 1 - dxDrawedZ)
     )
         drawedZ += dxDrawedZ;
     if (
         e.key === 'x' && (drawedZ > -1 + dxDrawedZ)
     )
         drawedZ -= dxDrawedZ;


 });
 var ctx = C.getContext('2d');

 var points = [];

 function DottedCubeInitGeometry() {
     var color = 'red';
     for (let x = -1; x <= 1; x += stepD) {
         for (let y = -1; y <= 1; y += stepD) {
             for (let z = -1; z <= 1; z += stepD) {
                 points.push([x, y, z, color]);
             }
         }
     }
 }

 function DottedGlobeInitGeometry() {
     var d = 0.9;
     var color;
     var color1
     var colorDx = 0.2;
     for (let radis = 0; radis <= 2 * Math.PI; radis += stepD) {
         var yp = d * Math.sin(radis)
         if ((Math.abs(yp) % colorDx >= -0.05) && (Math.abs(yp) % colorDx <= 0.05) && (Math.abs(yp) >= 0.01)) {
             color1 = "blue";

         } else {
             color1 = "white";
         }
         var newD = d * Math.cos(radis);
         for (let radis2 = 0; radis2 <= 2 * Math.PI; radis2 += stepD) {
             if ((Math.abs(xp) % colorDx >= -0.05) && (Math.abs(xp) % colorDx <= 0.05)) {
                 color = "yellow";
             } else {
                 color = color1
             }
             var xp = newD * Math.cos(radis2)
             var zp = newD * Math.sin(radis2)
             points.push([xp, yp, zp, color]);
         }
     }
 }

 function createDrawingFunction() {
     if (previousShapeButton) {
         previousShapeButton.classList.toggle('button-active')
         previousShapeButton = null;
     }
     var functionText = document.querySelector('.math-drawing-groub textarea').value;
     DottedShapFunction = eval(`()=> { ${functionText}}`);
     dottedshape = 'dottedshapfunction'
     DottedInitGeometry('dottedshapfunction');
 }

 function drawDots() {
     constructure.innerText = drawDottedConstrcuter;
     drawPointsMode = !drawPointsMode
 }

 function pushXClient(e) {
     var x = e.clientX - canvasOffsetX + W / 2;
     return ((((x) / W) * (m_max_x - m_min_x)) + m_min_x) * (drawedZ + mainDeepth);
 }

 function pushYClient(e) {
     var y = e.clientY - canvasOffsetY + H / 2;
     return ((m_max_y - m_min_y) - ((y) / H) * (m_max_y - m_min_y) + m_min_y) * (drawedZ + mainDeepth)
 }

 function DottedInitGeometry(shape) {
     points = [];

     switch (shape) {
         case 'globe':
             DottedGlobeInitGeometry()
             break;
         case 'cube':
             DottedCubeInitGeometry()
             break;
         case 'dottedshapfunction':
             if (DottedShapFunction) {
                 DottedShapFunction()
             }
             break;
         default:
             break;
     }
 }

 function project(point) {
     var perspectivPe = persP(point);
     var x = perspectivPe[0]
     var y = perspectivPe[1]
     var z = perspectivPe[2]
     if (!solidMode) {
         return [
             W * ((x - m_min_x) / (m_max_x - m_min_x)),
             H * (1 - (y - m_min_y) / (m_max_y - m_min_y)),
         ];
     }
     return new Vector(
         W * (x - m_min_x) / (m_max_x - m_min_x),
         H * (1 - (y - m_min_y) / (m_max_y - m_min_y)), z
     );
 }

 function persP(point) {
     var x = point[0]
     var y = point[1]
     var z = point[2]
     if (!solidMode) {

         return [((x + camerax)) / (z + mainDeepth), ((y + cameray)) / (z + mainDeepth)]
             //  return [(x + camerax) * (mainDeepth / (z + mainDeepth)), (y + cameray) * ((mainDeepth) / (z + mainDeepth))]
     }
     return new Vector(((x + camerax)) / (z + mainDeepth), ((y + cameray)) / (z + mainDeepth), z)

 }

 function rotatDottedY(theta, ponit) {
     var x = ponit[0]
     var y = ponit[1]
     var z = ponit[2]
     return [
         Math.cos(theta) * x + Math.sin(theta) * z,
         y,
         Math.sin(theta) * x - Math.cos(theta) * z
     ];
 }

 function rotatDottedX(theta, ponit) {
     var x = ponit[0]
     var y = ponit[1]
     var z = ponit[2]
     return [
         x,
         Math.cos(theta) * y - Math.sin(theta) * z,
         Math.sin(theta) * y + Math.cos(theta) * z
     ];
 }

 function rotatDottedZ(theta, ponit) {
     var x = ponit[0]
     var y = ponit[1]
     var z = ponit[2]
     return [
         (Math.sqrt(x * x + y * y)) * (Math.cos(theta) * x / Math.sqrt(x * x + y * y) - Math.sin(theta) * y / Math.sqrt(x * x + y * y)), //- Math.sin(theta) * z, cosxcosy−sinxsiny
         (Math.sqrt(x * x + y * y)) * (y / Math.sqrt(x * x + y * y) * Math.cos(theta) + x / Math.sqrt(x * x + y * y) * Math.sin(theta)), //+ Math.cos(theta) * z,
         z
     ];
 }

 function drawPoint(point, color) {
     var proP = project(point)
     var x = proP[0];
     var y = proP[1];
     ctx.beginPath()
     ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
     ctx.strokeStyle = color;
     ctx.fill()
     ctx.stroke();
 }
 var theta = 0;
 var dtheta = 0.1;

 function draw() {
     ctx.clearRect(0, 0, H, W);
     if (!solidMode) {
         points.forEach((point) => {
             var color = point[3];
             if (rotatex)
                 point = rotatDottedX(rotatexspeed * theta, point)
             if (rotatey)
                 point = rotatDottedY(rotateyspeed * theta, point)
             if (rotatez)
                 point = rotatDottedZ(rotatezspeed * theta, point)
             drawPoint(point, color)
         })
     } else {
         squars.forEach((squar, idx) => {
             squar = squar.map((point) => {

                 point = point.rotatX(rotatexspeed * theta)
                 point = point.rotatY(rotatexspeed * theta)
                     //  point = point.rotatZ(0.2 * theta)
                 return point;
             })
             var color = colors[idx];
             drawSquare(squar, color)
         })
     }

     theta += dtheta
     requestAnimationFrame(draw)
 }
 draw();
 //  return [ 
 //     (Math.sqrt(x * x + y * y)) * Math.cos(theta) * x / Math.sqrt(x * x + y * y) - Math.sin(theta) * y / Math.sqrt(x * x + y * y), //- Math.sin(theta) * z, cosxcosy−sinxsiny
 //     (Math.sqrt(x * x + y * y)) * Math.sin(theta), //+ Math.cos(theta) * z,
 //     z
 // ]; beautifull shape / rotat x