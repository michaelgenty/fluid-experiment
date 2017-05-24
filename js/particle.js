/*Base particles script get from dissimulate on codepen*/

var Particle = function(type, x, y){
    this.type = type;
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
};


Particle.prototype.first_process = function () {

    var g = fluid.grid[Math.round(this.y / fluid.spacing) * fluid.num_x + Math.round(this.x / fluid.spacing)];

    if (g) g.close[g.length++] = this;

    this.vx = this.x - this.px;
    this.vy = this.y - this.py;

    if (fluid.mouse.down) {

    }

    this.vx += settings.GRAVITY_X;
    this.vy += settings.GRAVITY_Y;
    this.px = this.x;
    this.py = this.y;
    this.x += this.vx;
    this.y += this.vy;
};


Particle.prototype.second_process = function () {

    var force = 0,
        force_b = 0,
        cell_x = Math.round(this.x / fluid.spacing),
        cell_y = Math.round(this.y / fluid.spacing),
        close = [];

    for (var x_off = -1; x_off < 2; x_off++) {
        for (var y_off = -1; y_off < 2; y_off++) {
            var cell = fluid.grid[(cell_y + y_off) * fluid.num_x + (cell_x + x_off)];
            if (cell && cell.length) {
                for (var a = 0, l = cell.length; a < l; a++) {
                    var particle = cell.close[a];
                    if (particle != this) {
                        var dfx = particle.x - this.x;
                        var dfy = particle.y - this.y;
                        var distance = Math.sqrt(dfx * dfx + dfy * dfy);
                        if (distance < fluid.spacing) {
                            var m = 1 - (distance / fluid.spacing);
                            force += Math.pow(m, 2);
                            force_b += Math.pow(m, 3) / 2;
                            particle.m = m;
                            particle.dfx = (dfx / distance) * m;
                            particle.dfy = (dfy / distance) * m;
                            close.push(particle);
                        }
                    }
                }
            }
        }
    }

    force = (force - 3) * 0.5;

    for (var i = 0, l = close.length; i < l; i++) {

        var neighbor = close[i];

        var press = force + force_b * neighbor.m;
        if (this.type != neighbor.type) press *= 0.35;

        var dx = neighbor.dfx * press * 0.5; //increase rebound
        var dy = neighbor.dfy * press * 0.5;

        neighbor.x += dx;
        neighbor.y += dy;
        this.x -= dx;
        this.y -= dy;
    }

    if (this.x < fluid.limit) this.x = fluid.limit;
    else if (this.x > fluid.width - fluid.limit) this.x = fluid.width - fluid.limit;

    if (this.y < fluid.limit) this.y = fluid.limit;
    else if (this.y > fluid.height - fluid.limit) this.y = fluid.height - fluid.limit;

    this.draw();
};


Particle.prototype.draw = function () {

    var size = fluid.radius * 2;

    fluid.meta_ctx.drawImage(
        fluid.textures[this.type],
        this.x - fluid.radius,
        this.y - fluid.radius,
        size,
        size);

};
