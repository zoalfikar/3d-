 //limit
 var H = 600,
     W = 600;
 var m_min_x = -3,
     m_max_x = 3;
 var m_min_y = -3,
     m_max_y = 3;
 var step = 0.1;
 var C = document.getElementById('canvas') // as HTMLCanvasElement;
 var ctx = C.getContext('2d');

 var points = [];

 //  function initGeometry() {

 //      for (let x = m_min_x; x <= m_max_x; x += step) {
 //          for (let y = m_min_y; y <= m_max_y; y += step) {
 //              for (let z = -2; z <= 2; z += step) {
 //                  points.push([x, y, z]);
 //              }
 //          }
 //      }
 //  }


 function initGeometry() {
     var d = 2;
     var drad = 0.1;
     for (let radis = 0; radis <= 2 * Math.PI; radis += drad) {
         var yp = d * Math.sin(radis)
         var newD = d * Math.cos(radis);
         for (let radis2 = 0; radis2 <= 2 * Math.PI; radis2 += drad) {
             var xp = newD * Math.cos(radis2)
             var zp = newD * Math.sin(radis2)
             points.push([xp, yp, zp]);
         }
     }
 }
 //  function initGeometry() {
 //     var radis = 0;
 //     //  var radis2 = 0;
 //     var d = 2;
 //     var drad = 0.1;
 //     var drad2 = 0.4;
 //     for (radis; radis <= 2 * Math.PI; radis += drad) {
 //         var xp = d * Math.cos(radis)
 //         var yp = d * Math.sin(radis)

 //         for (let radis2 = 0; radis2 <= 2 * Math.PI; radis2 += drad2) {
 //             var zp = d * Math.sin(radis2)
 //             points.push([xp, yp, zp]);
 //         }
 //         //  points.push([xp, yp, 0]);
 //         //  points.push([xp / 2, yp / 2, 1]);
 //         //  points.push([xp / 4, yp / 4, 2]);
 //         //  points.push([xp / 9, yp / 9, 3]);
 //         //  points.push([0, 0, 4]);
 //     }
 // }
 //  function initGeometry() {
 //      var radis = 0;
 //      var radis2 = 0;
 //      var d = 2;
 //      var drad = 0.1;
 //      var drad2 = 0.5;
 //      //  for (radis; radis <= 2 * Math.PI; radis += drad) {
 //      //      var xp = d * Math.cos(radis)
 //      //      var yp = d * Math.sin(radis)
 //      for (radis; radis <= 2 * Math.PI; radis += drad) {
 //          var xp = d * Math.cos(radis)

 //          var zp = d * Math.sin(radis)
 //          console.log(radis);
 //          points.push([xp, 1, zp]);
 //          //  console.log([xp, yp, 0]);
 //      }
 //      //  }
 //  }

 function project(point) {
     var perspectivPe = persP(point);
     var x = perspectivPe[0]
     var y = perspectivPe[1]

     return [
         W * (x - m_min_x) / (m_max_x - m_min_x),
         H * (1 - (y - m_min_y) / (m_max_y - m_min_y)),
     ];
 }

 function persP(point) {
     var x = point[0]
     var y = point[1]
     var z = point[2]
     return [x / (z + 5), y / (z + 5)]
 }

 function rotatY(theta, ponit) {
     var x = ponit[0]
     var y = ponit[1]
     var z = ponit[2]
     return [
         Math.cos(theta) * x + Math.sin(theta) * z,
         y,
         Math.sin(theta) * x - Math.cos(theta) * z
     ];
 }

 function rotatX(theta, ponit) {
     var x = ponit[0]
     var y = ponit[1]
     var z = ponit[2]
     return [
         x,
         Math.cos(theta) * y - Math.sin(theta) * z,
         Math.sin(theta) * y + Math.cos(theta) * z
     ];
 }
 //  return [
 //     (Math.sqrt(x * x + y * y)) * Math.cos(theta) * x / Math.sqrt(x * x + y * y) - Math.sin(theta) * y / Math.sqrt(x * x + y * y), //- Math.sin(theta) * z, cosxcosy−sinxsiny
 //     (Math.sqrt(x * x + y * y)) * Math.sin(theta), //+ Math.cos(theta) * z,
 //     z
 // ]; beautifull shape
 function rotatZ(theta, ponit) {
     var x = ponit[0]
     var y = ponit[1]
     var z = ponit[2]
     return [
         (Math.sqrt(x * x + y * y)) * (Math.cos(theta) * x / Math.sqrt(x * x + y * y) - Math.sin(theta) * y / Math.sqrt(x * x + y * y)), //- Math.sin(theta) * z, cosxcosy−sinxsiny
         (Math.sqrt(x * x + y * y)) * (y / Math.sqrt(x * x + y * y) * Math.cos(theta) + x / Math.sqrt(x * x + y * y) * Math.sin(theta)), //+ Math.cos(theta) * z,
         z
     ];
 }

 //  function drawPoint(point) {

 //      var proP = project(point)
 //      var x = proP[0];
 //      var y = proP[1];
 //      ctx.beginPath()
 //      ctx.moveTo(x + 1, y + 1);
 //      ctx.lineTo(x, y);
 //      ctx.lineWidth = 4;
 //      ctx.strokeStyle = 'white';
 //      ctx.stroke();
 //  }
 function drawPoint(point) {

     var proP = project(point)
     var x = proP[0];
     var y = proP[1];
     ctx.beginPath()
     ctx.moveTo(x + 1, y + 1);
     ctx.lineTo(x, y);
     ctx.lineWidth = 4;
     if (point[3] == 1) {
         ctx.strokeStyle = 'blue';

     } else {
         ctx.strokeStyle = 'white';

     }
     ctx.stroke();
 }
 var theta = 0;
 var dtheta = 0.01;

 function draw() {
     ctx.clearRect(0, 0, H, W);
     points.forEach((point) => {
         //  point = rotatX(theta, point)
         point = rotatY(theta, point)
             //  point = rotatZ(0.2 * theta, point)
         drawPoint(point)
     })
     theta += dtheta
     requestAnimationFrame(draw)
 }

 initGeometry()
 draw();