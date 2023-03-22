class Vector {
    constructor(x, y, z) {
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }
    cross(other) {
        return new Vector(
            this[1] * other[2] - this[2] * other[1],
            this[0] * other[2] - this[2] * other[0],
            this[0] * other[1] - this[1] * other[0]
        )
    }
    ccw(other) {
        return this.cross(other)[2] < 0
    }
    add(other) {
        return new Vector(this[0] + other[0], this[1] + other[1],
            this[2] + other[2]
        )
    }
    scale(scalar) {
        return new Vector(scalar * this[0], scalar * this[1],
            scalar * this[2]
        )
    }
    subtract(other) {
        // return this.add(other.scale(-1))
        return new Vector(this[0] - other[0], this[1] - other[1],
            this[2] - other[2]
        )
    }
    rotatY(theta) {
        var x = this[0]
        var y = this[1]
        var z = this[2]
        return new Vector(
            Math.cos(theta) * x + Math.sin(theta) * z,
            y,
            Math.sin(theta) * x - Math.cos(theta) * z
        );
    }

    rotatX(theta) {
        var x = this[0]
        var y = this[1]
        var z = this[2]
        return new Vector(x,
            Math.cos(theta) * y - Math.sin(theta) * z,
            Math.sin(theta) * y + Math.cos(theta) * z
        );
    }

    rotatZ(theta) {
        var x = this[0]
        var y = this[1]
        var z = this[2]
        return new Vector((Math.sqrt(x * x + y * y)) * (Math.cos(theta) * x / Math.sqrt(x * x + y * y) - Math.sin(theta) * y / Math.sqrt(x * x + y * y)), //- Math.sin(theta) * z, cosxcosy−sinxsiny
            (Math.sqrt(x * x + y * y)) * (y / Math.sqrt(x * x + y * y) * Math.cos(theta) + x / Math.sqrt(x * x + y * y) * Math.sin(theta)), //+ Math.cos(theta) * z,
            z
        );
    }
}