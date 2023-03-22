 //limit
 var H = 600,
     W = 600;
 var m_min_x = -1,
     m_max_x = 1;
 var m_min_y = -1,
     m_max_y = 1;
 var step = 0.1;
 var C = document.getElementById('canvas') // as HTMLCanvasElement;
 var ctx = C.getContext('2d');

 var points = [];
 var traingles = [];
 var colors = [
     'red', 'green', 'blue', 'white',
     'orange', 'purple', 'cyan', 'yellow'
 ];

 function makeTraingle(a, b, c, dimention, side) {
     var side1 = b.subtract(a),
         side2 = c.subtract(a);
     var orientationVec = side1.cross(side2);
     if (Math.sign(orientationVec[dimention]) == Math.sign(side)) {

         return [a, b, c];
     }
     return [a, c, b];

 }

 function initGeometry() {
     for (let x = -1; x <= 1; x += 2) {
         for (let y = -1; y <= 1; y += 2) {
             for (let z = -1; z <= 1; z += 2) {
                 points.push(new Vector(x, y, z));
             }
         }
     }
     for (let dimention = 0; dimention <= 2; dimention++) {
         for (let side = -1; side <= 1; side += 2) {
             var sidePoints = points.filter((point) => {
                 return point[dimention] == side;
             });
             var a = sidePoints[0],
                 b = sidePoints[1],
                 c = sidePoints[2],
                 d = sidePoints[3];
             if (dimention == 1) {
                 traingles.push(makeTraingle(a, b, c, dimention, side));
                 traingles.push(makeTraingle(d, b, c, dimention, side));
             } else {
                 traingles.push(makeTraingle(a, b, c, dimention, -side));
                 traingles.push(makeTraingle(d, b, c, dimention, -side));
             }

         }
     }
 }






 function project(point) {
     var perspectivPe = persP(point);
     var x = perspectivPe[0]
     var y = perspectivPe[1]
     var z = perspectivPe[2]

     return new Vector(
         W * (x - m_min_x) / (m_max_x - m_min_x),
         H * (1 - (y - m_min_y) / (m_max_y - m_min_y)), z
     );
 }

 function persP(point) {
     var x = point[0]
     var y = point[1]
     var z = point[2]
     return new Vector(x / (z + 5), y / (z + 5), z)
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

 function drawTraingle(traingle, color) {

     var proT = traingle.map(project)
     var a = proT[0];
     var b = proT[1];
     var c = proT[2];
     var side1 = b.subtract(a)
     var side2 = c.subtract(a)
     if (side1.ccw(side2) == false) {
         ctx.beginPath()
         ctx.moveTo(a[0], a[1]);
         ctx.lineTo(b[0], b[1]);
         ctx.lineTo(c[0], c[1]);
         ctx.lineTo(a[0], a[1]);
         ctx.strokeStyle = 'white';
         ctx.fillStyle = color;
         ctx.stroke();
         ctx.fill();
     }
 }
 var theta = 0;
 var dtheta = 0.01;

 function draw() {
     ctx.clearRect(0, 0, H, W);
     traingles.forEach((traingle, idx) => {
         traingle = traingle.map((point) => {

             point = point.rotatX(theta)
             point = point.rotatY(0.2 * theta)
                 //  point =point.rotatZ(0.2 * theta)
             return point;
         })
         var color = colors[Math.floor(idx / 2)];
         drawTraingle(traingle, color)
     })
     theta += dtheta
     requestAnimationFrame(draw)
 }

 initGeometry()
 draw();