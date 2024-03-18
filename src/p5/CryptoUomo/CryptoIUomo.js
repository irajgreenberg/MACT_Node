// CryptoIra
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

/* TO BE REMOVED - EXAMPLE OF AB TOKEN DATA OBJECT */
let tokenData = {
    hash: "0x07dac155a673b2665ec14ef0cdab543c2ae3fd163cc9d80b736d11f35bf76340",
    tokenId: 1,
    externalAssetDependencies: [
        {
            cid: "",
            dependencyType: "",
            data: ""
        },
    ],
    preferredIPFSGateway: "https://ipfs.brightmoments.io/ipfs",
}
/* TO BE REMOVED - EXAMPLE OF AB TOKEN DATA OBJECT */

class Random {
    constructor() {
        this.useA = false;
        let sfc32 = function (uint128Hex) {
            let a = parseInt(uint128Hex.substring(0, 8), 16);
            let b = parseInt(uint128Hex.substring(8, 16), 16);
            let c = parseInt(uint128Hex.substring(16, 24), 16);
            let d = parseInt(uint128Hex.substring(24, 32), 16);
            return function () {
                a |= 0;
                b |= 0;
                c |= 0;
                d |= 0;
                let t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };
        // seed prngA with first half of tokenData.hash
        this.prngA = new sfc32(tokenData.hash.substring(2, 34));
        // seed prngB with second half of tokenData.hash
        this.prngB = new sfc32(tokenData.hash.substring(34, 66));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }
    // random number between 0 (inclusive) and 1 (exclusive)
    random_dec() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }
    // random number between a (inclusive) and b (exclusive)
    random_num(a, b) {
        return a + (b - a) * this.random_dec();
    }
    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    random_int(a, b) {
        return Math.floor(this.random_num(a, b + 1));
    }
    // random boolean with p as percent liklihood of true
    random_bool(p) {
        return this.random_dec() < p;
    }
    // random value in an array of items
    random_choice(list) {
        return list[this.random_int(0, list.length - 1)];
    }
}

let R = new Random();

minFiles = 0;
maxFiles = 0; // TOTAL NUMBER OF PROJECTS

const SEED = R.random_int(minFiles, maxFiles);
console.log(`Selection: ${SEED}`);



var _00 = function () {
    this.seed = SEED;
    (() => { "use strict"; var s = { 48: (s, t) => { Object.defineProperty(t, "__esModule", { value: !0 }), t.VerletNode = void 0, t.VerletNode = class { constructor(s, t, i, o) { this.isEllipsoid = !1, this.p = s, this.pos = t, this.radius = i, this.col = o, this.radiusOld = this.radius, this.posOld = s.createVector(t.x, t.y, t.z) } nudge(s) { this.offset = s, this.pos.add(this.offset) } verlet() { var s = this.p.createVector(this.pos.x, this.pos.y, this.pos.z); this.pos.x += this.pos.x - this.posOld.x, this.pos.y += this.pos.y - this.posOld.y, this.pos.z += this.pos.z - this.posOld.z, this.posOld.set(s) } draw(s = 10) { this.p.fill(this.col), this.p.noStroke(), this.p.push(), this.p.translate(this.pos.x, this.pos.y, this.pos.z), "number" == typeof this.radius ? this.p.sphere(this.radius, s, s) : this.p.ellipsoid(this.radius.x, this.radius.y, this.radius.z, s, s), this.p.pop() } setStyle(s, t) { this.radius = s, this.col = t } boundsCollide(s) { "number" == typeof this.radius ? (this.pos.x > s.x / 2 - this.radius ? (this.pos.x = s.x / 2 - this.radius, this.pos.x -= 1) : this.pos.x < -s.x / 2 + this.radius && (this.pos.x = -s.x / 2 + this.radius, this.pos.x += 1), this.pos.y > s.y / 2 - this.radius ? (this.pos.y = s.y / 2 - this.radius, this.pos.y -= 1) : this.pos.y < -s.y / 2 + this.radius && (this.pos.y = -s.y / 2 + this.radius, this.pos.y += 1), this.pos.z > s.z / 2 - this.radius ? (this.pos.z = s.z / 2 - this.radius, this.pos.z -= 1) : this.pos.z < -s.z / 2 + this.radius && (this.pos.z = -s.z / 2 + this.radius, this.pos.z += 1)) : (this.pos.x > s.x / 2 - this.radius.x ? (this.pos.x = s.x / 2 - this.radius.x, this.pos.x -= this.radius.x) : this.pos.x < -s.x / 2 + this.radius.x && (this.pos.x = -s.x / 2 + this.radius.x, this.pos.x += this.radius.x), this.pos.y > s.y / 2 - this.radius.y ? (this.pos.y = s.y / 2 - this.radius.y, this.pos.y -= this.radius.y) : this.pos.y < -s.y / 2 + this.radius.y && (this.pos.y = -s.y / 2 + this.radius.y, this.pos.y += this.radius.y), this.pos.z > s.z / 2 - this.radius.z ? (this.pos.z = s.z / 2 - this.radius.z, this.pos.z -= this.radius.z) : this.pos.z < -s.z / 2 + this.radius.z && (this.pos.z = -s.z / 2 + this.radius.z, this.pos.z += this.radius.z)) } } }, 330: (s, t) => { Object.defineProperty(t, "__esModule", { value: !0 }), t.VerletStick = void 0, t.VerletStick = class { constructor(s, t, i, o = .5, h = 0, e = s.color(200, 225, 200)) { this.p = s, this.start = t, this.end = i, this.len = this.start.pos.dist(this.end.pos), this.stickTension = o, this.anchorTerminal = h, this.col = e } constrainLen() { for (let s = 0; s < 10; s++) { let s = this.p.createVector(this.end.pos.x - this.start.pos.x, this.end.pos.y - this.start.pos.y, this.end.pos.z - this.start.pos.z), t = s.mag(), i = 0, o = 0; switch (this.anchorTerminal) { case 0: default: i = .5, o = .5; break; case 1: i = 0, o = 1; break; case 2: i = 1, o = 0; break; case 3: i = 0, o = 0 }let h = (t - this.len) / t; this.start.pos.x += s.x * (i * this.stickTension * h), this.start.pos.y += s.y * (i * this.stickTension * h), this.start.pos.z += s.z * (i * this.stickTension * h), this.end.pos.x -= s.x * (o * this.stickTension * h), this.end.pos.y -= s.y * (o * this.stickTension * h), this.end.pos.z -= s.z * (o * this.stickTension * h) } } nudge(s, t) { 0 == s ? this.start.nudge(t) : this.end.nudge(t) } draw() { this.p.stroke(this.col), this.p.noFill(), this.p.beginShape(), this.p.vertex(this.start.pos.x, this.start.pos.y, this.start.pos.z), this.p.vertex(this.end.pos.x, this.end.pos.y, this.end.pos.z), this.p.endShape() } boundsCollide(s) { this.start.boundsCollide(s), this.end.boundsCollide(s) } setColor(s) { this.col = s } setOpacity(s) { } setVisibility(s) { } reinitializeLen() { this.len = this.start.pos.dist(this.end.pos) } } }, 413: function (s, t, i) { var o = this && this.__importDefault || function (s) { return s && s.__esModule ? s : { default: s } }; Object.defineProperty(t, "__esModule", { value: !0 }), t.CryptoIra = void 0; const h = o(i(472)), e = i(330), r = i(48); t.CryptoIra = class { constructor(s, t, i) { this.vBlocks = [], this.vSticks = [], this.data = [-.185, -.129, 0, -.185, -.1, 0, -.185, -.0714, 0, -.169, -.186, 0, -.169, -.157, 0, -.169, -.129, 0, -.169, -.1, 0, -.169, -.0714, 0, -.169, -.0429, 0, -.169, -.0143, 0, -.153, -.186, 0, -.153, -.157, 0, -.153, -.129, 0, -.153, -.1, 0, -.153, -.0714, 0, -.153, -.0429, 0, -.153, -.0143, 0, -.153, .0143, 0, -.137, -.243, 0, -.137, -.214, 0, -.137, -.186, 0, -.137, -.157, 0, -.137, -.0143, 0, -.137, .0143, 0, -.121, -.243, 0, -.121, -.214, 0, -.121, -.186, 0, -.121, -.157, 0, -.121, -.0143, 0, -.121, .0143, 0, -.121, .443, 0, -.104, -.243, 0, -.104, -.214, 0, -.104, -.186, 0, -.104, .0143, 0, -.104, .0429, 0, -.104, .0714, 0, -.104, .1, 0, -.104, .129, 0, -.104, .186, 0, -.104, .214, 0, -.104, .243, 0, -.104, .271, 0, -.104, .3, 0, -.104, .414, 0, -.0884, -.243, 0, -.0884, -.214, 0, -.0884, -.186, 0, -.0884, -.157, 0, -.0884, -.129, 0, -.0884, -.1, 0, -.0884, -.0714, 0, -.0884, -.0429, 0, -.0884, -.0143, 0, -.0884, .0143, 0, -.0884, .0429, 0, -.0884, .0714, 0, -.0884, .1, 0, -.0884, .129, 0, -.0884, .157, 0, -.0884, .186, 0, -.0884, .243, 0, -.0884, .271, 0, -.0884, .3, 0, -.0884, .329, 0, -.0884, .357, 0, -.0884, .386, 0, -.0884, .414, 0, -.0723, -.271, 0, -.0723, -.243, 0, -.0723, -.214, 0, -.0723, -.186, 0, -.0723, -.157, 0, -.0723, -.129, 0, -.0723, -.1, 0, -.0723, -.0714, 0, -.0723, -.0429, 0, -.0723, -.0143, 0, -.0723, .0143, 0, -.0723, .0429, 0, -.0723, .0714, 0, -.0723, .1, 0, -.0723, .129, 0, -.0723, .157, 0, -.0723, .186, 0, -.0723, .214, 0, -.0723, .243, 0, -.0723, .271, 0, -.0723, .3, 0, -.0723, .329, 0, -.0723, .357, 0, -.0723, .386, 0, -.0723, .414, 0, -.0563, -.271, 0, -.0563, -.243, 0, -.0563, -.214, 0, -.0563, -.186, 0, -.0563, -.157, 0, -.0563, -.129, 0, -.0563, -.1, 0, -.0563, -.0714, 0, -.0563, -.0429, 0, -.0563, -.0143, 0, -.0563, .0143, 0, -.0563, .0429, 0, -.0563, .0714, 0, -.0563, .1, 0, -.0563, .129, 0, -.0563, .157, 0, -.0563, .186, 0, -.0563, .214, 0, -.0563, .243, 0, -.0563, .271, 0, -.0563, .3, 0, -.0402, -.414, 0, -.0402, -.386, 0, -.0402, -.357, 0, -.0402, -.271, 0, -.0402, -.243, 0, -.0402, -.214, 0, -.0402, -.186, 0, -.0402, -.157, 0, -.0402, -.129, 0, -.0402, -.1, 0, -.0402, -.0714, 0, -.0402, -.0429, 0, -.0402, -.0143, 0, -.0402, .0143, 0, -.0402, .0429, 0, -.0402, .0714, 0, -.0402, .1, 0, -.0402, .129, 0, -.0402, .157, 0, -.0241, -.414, 0, -.0241, -.386, 0, -.0241, -.357, 0, -.0241, -.329, 0, -.0241, -.3, 0, -.0241, -.271, 0, -.0241, -.243, 0, -.0241, -.214, 0, -.0241, -.186, 0, -.0241, -.157, 0, -.0241, -.129, 0, -.0241, -.1, 0, -.0241, -.0714, 0, -.0241, -.0429, 0, -.0241, -.0143, 0, -.0241, .0143, 0, -.0241, .0714, 0, -.00804, -.414, 0, -.00804, -.386, 0, -.00804, -.357, 0, -.00804, -.329, 0, -.00804, -.3, 0, -.00804, -.271, 0, -.00804, -.243, 0, -.00804, -.214, 0, -.00804, -.186, 0, -.00804, -.157, 0, -.00804, -.129, 0, -.00804, -.1, 0, -.00804, -.0714, 0, -.00804, -.0429, 0, -.00804, -.0143, 0, -.00804, .0143, 0, .00804, -.414, 0, .00804, -.386, 0, .00804, -.357, 0, .00804, -.329, 0, .00804, -.3, 0, .00804, -.271, 0, .00804, -.243, 0, .00804, -.214, 0, .00804, -.186, 0, .00804, -.157, 0, .00804, -.129, 0, .00804, -.1, 0, .00804, -.0714, 0, .00804, -.0429, 0, .00804, -.0143, 0, .00804, .0714, 0, .0241, -.414, 0, .0241, -.386, 0, .0241, -.357, 0, .0241, -.329, 0, .0241, -.3, 0, .0241, -.271, 0, .0241, -.243, 0, .0241, -.214, 0, .0241, -.186, 0, .0241, -.157, 0, .0241, -.129, 0, .0241, -.1, 0, .0241, -.0714, 0, .0241, -.0429, 0, .0241, -.0143, 0, .0241, .0143, 0, .0241, .0429, 0, .0241, .0714, 0, .0241, .1, 0, .0241, .129, 0, .0402, -.386, 0, .0402, -.357, 0, .0402, -.271, 0, .0402, -.243, 0, .0402, -.214, 0, .0402, -.186, 0, .0402, -.157, 0, .0402, -.129, 0, .0402, -.1, 0, .0402, -.0714, 0, .0402, -.0429, 0, .0402, -.0143, 0, .0402, .0143, 0, .0402, .0429, 0, .0402, .0714, 0, .0402, .1, 0, .0402, .129, 0, .0402, .157, 0, .0402, .186, 0, .0562, -.271, 0, .0562, -.243, 0, .0562, -.214, 0, .0562, -.186, 0, .0562, -.157, 0, .0562, -.129, 0, .0562, -.1, 0, .0562, -.0714, 0, .0562, -.0429, 0, .0562, -.0143, 0, .0562, .0143, 0, .0562, .0429, 0, .0562, .0714, 0, .0562, .1, 0, .0562, .129, 0, .0562, .186, 0, .0562, .214, 0, .0562, .243, 0, .0562, .271, 0, .0562, .3, 0, .0723, -.271, 0, .0723, -.243, 0, .0723, -.214, 0, .0723, -.186, 0, .0723, -.157, 0, .0723, -.129, 0, .0723, -.1, 0, .0723, -.0714, 0, .0723, -.0429, 0, .0723, -.0143, 0, .0723, .0143, 0, .0723, .0429, 0, .0723, .0714, 0, .0723, .1, 0, .0723, .157, 0, .0723, .186, 0, .0723, .214, 0, .0723, .243, 0, .0723, .271, 0, .0723, .3, 0, .0723, .329, 0, .0723, .357, 0, .0723, .386, 0, .0723, .414, 0, .0884, -.271, 0, .0884, -.243, 0, .0884, -.214, 0, .0884, .0143, 0, .0884, .0429, 0, .0884, .0714, 0, .0884, .1, 0, .0884, .129, 0, .0884, .157, 0, .0884, .186, 0, .0884, .214, 0, .0884, .243, 0, .0884, .271, 0, .0884, .3, 0, .0884, .329, 0, .0884, .357, 0, .0884, .386, 0, .0884, .414, 0, .104, -.243, 0, .104, -.186, 0, .104, -.0143, 0, .104, .0143, 0, .104, .0714, 0, .104, .1, 0, .104, .129, 0, .104, .214, 0, .104, .243, 0, .104, .414, 0, .104, .443, 0, .121, -.243, 0, .121, -.214, 0, .121, -.186, 0, .121, -.157, 0, .121, -.0143, 0, .121, .0143, 0, .121, .443, 0, .137, -.214, 0, .137, -.186, 0, .137, -.157, 0, .137, -.1, 0, .137, -.0714, 0, .137, -.0429, 0, .137, -.0143, 0, .137, .443, 0, .153, -.186, 0, .153, -.157, 0, .153, -.129, 0, .153, -.1, 0, .153, -.0714, 0, .153, -.0429, 0, .153, -.0143, 0, .169, -.186, 0, .169, -.157, 0, .169, -.129, 0, .169, -.1, 0, .169, -.0714, 0, .185, -.129, 0, .185, -.1, 0], this.cols = [221, 165, 138, 235, 189, 162, 208, 155, 129, 229, 171, 146, 239, 184, 160, 214, 161, 139, 200, 145, 119, 212, 159, 134, 231, 185, 162, 187, 132, 116, 246, 195, 176, 213, 157, 131, 48, 17, 10, 141, 82, 63, 105, 49, 33, 176, 116, 89, 202, 142, 121, 127, 72, 65, 230, 177, 143, 225, 174, 145, 247, 202, 182, 136, 79, 60, 211, 152, 130, 42, 15, 10, 250, 210, 189, 196, 144, 115, 202, 157, 137, 88, 36, 23, 147, 84, 68, 53, 21, 14, 121, 60, 55, 240, 202, 181, 200, 146, 119, 90, 37, 21, 141, 96, 78, 228, 184, 161, 219, 173, 151, 221, 176, 154, 184, 135, 115, 129, 81, 69, 193, 131, 115, 166, 108, 90, 173, 115, 98, 138, 85, 69, 180, 123, 108, 233, 189, 160, 246, 211, 190, 169, 124, 106, 211, 159, 129, 220, 169, 140, 230, 187, 159, 216, 164, 137, 234, 188, 161, 240, 199, 174, 233, 191, 167, 232, 191, 167, 219, 174, 153, 187, 139, 119, 193, 140, 120, 184, 120, 102, 138, 76, 61, 69, 36, 24, 92, 47, 34, 85, 42, 29, 107, 57, 40, 153, 93, 75, 186, 123, 107, 119, 72, 61, 158, 122, 109, 230, 180, 151, 235, 196, 178, 137, 86, 71, 234, 188, 160, 230, 184, 154, 237, 198, 170, 224, 178, 153, 232, 192, 168, 209, 165, 141, 177, 129, 104, 128, 79, 63, 95, 56, 42, 126, 76, 61, 132, 77, 61, 50, 19, 12, 35, 14, 8, 30, 10, 6, 43, 19, 12, 66, 30, 20, 28, 7, 4, 46, 19, 10, 67, 31, 21, 88, 45, 36, 26, 8, 5, 227, 177, 153, 213, 158, 129, 216, 167, 147, 108, 64, 52, 220, 167, 138, 228, 186, 158, 232, 192, 166, 221, 174, 144, 189, 135, 110, 206, 161, 140, 168, 114, 93, 132, 79, 62, 79, 41, 30, 57, 28, 23, 43, 19, 15, 38, 12, 9, 39, 14, 11, 58, 27, 19, 67, 33, 24, 51, 20, 13, 37, 13, 9, 119, 105, 100, 210, 152, 128, 212, 153, 123, 218, 159, 136, 216, 158, 132, 198, 142, 122, 56, 25, 16, 226, 185, 159, 200, 150, 125, 229, 185, 157, 212, 161, 133, 193, 148, 124, 166, 115, 94, 122, 73, 56, 127, 76, 59, 70, 34, 23, 33, 11, 8, 39, 15, 10, 51, 21, 15, 229, 170, 153, 126, 94, 83, 227, 183, 171, 188, 125, 106, 229, 169, 149, 211, 141, 121, 214, 155, 134, 161, 112, 92, 30, 12, 8, 192, 139, 109, 186, 130, 102, 185, 137, 111, 179, 128, 104, 168, 118, 96, 161, 113, 94, 98, 49, 35, 34, 12, 9, 214, 156, 136, 144, 86, 74, 135, 74, 60, 209, 146, 131, 106, 49, 35, 158, 78, 66, 159, 102, 83, 108, 66, 51, 184, 130, 105, 100, 59, 43, 155, 106, 81, 61, 27, 19, 145, 92, 74, 140, 90, 71, 118, 76, 60, 168, 102, 89, 154, 99, 81, 51, 33, 27, 38, 20, 19, 69, 43, 35, 61, 28, 21, 177, 94, 76, 229, 178, 157, 235, 189, 168, 201, 138, 115, 188, 137, 111, 158, 104, 81, 181, 128, 101, 123, 74, 55, 103, 58, 44, 61, 34, 23, 131, 86, 70, 59, 46, 41, 93, 65, 56, 108, 68, 54, 124, 85, 74, 61, 32, 26, 90, 51, 39, 197, 131, 106, 231, 187, 169, 126, 73, 55, 145, 94, 72, 81, 42, 30, 103, 61, 45, 78, 44, 32, 58, 31, 22, 61, 38, 29, 135, 87, 70, 35, 15, 10, 118, 72, 58, 158, 108, 90, 34, 25, 21, 140, 133, 126, 85, 42, 34, 121, 76, 62, 221, 161, 132, 218, 167, 146, 79, 46, 34, 86, 51, 37, 72, 44, 34, 105, 68, 51, 96, 58, 41, 42, 22, 17, 162, 117, 97, 160, 110, 89, 151, 103, 83, 140, 94, 79, 194, 150, 133, 163, 120, 106, 136, 92, 79, 172, 125, 107, 132, 82, 64, 214, 158, 132, 184, 125, 102, 58, 34, 26, 73, 42, 29, 56, 29, 21, 96, 57, 41, 61, 34, 23, 54, 25, 16, 206, 167, 146, 198, 157, 140, 203, 156, 136, 174, 131, 116, 166, 123, 112, 72, 37, 31, 149, 90, 71, 177, 134, 118, 203, 156, 132, 177, 123, 99, 130, 85, 66, 171, 115, 92, 176, 117, 91, 104, 62, 46, 120, 82, 68, 82, 47, 37, 122, 85, 73, 89, 54, 41, 144, 109, 95, 144, 105, 92, 125, 75, 58, 142, 92, 73, 155, 112, 93, 122, 85, 71, 85, 51, 41, 145, 92, 78, 144, 91, 77, 148, 90, 71, 119, 73, 59, 112, 63, 47, 162, 110, 85, 155, 97, 75, 149, 95, 77, 159, 104, 91, 147, 105, 98, 92, 62, 51, 115, 73, 55, 139, 107, 97, 74, 35, 26, 108, 84, 76, 114, 99, 96, 65, 50, 44, 30, 14, 12, 74, 41, 32, 133, 87, 77, 77, 36, 29, 60, 28, 19, 70, 34, 24, 76, 37, 24, 60, 27, 16, 52, 20, 11, 96, 53, 35, 172, 120, 111, 120, 71, 52, 27, 14, 9, 171, 94, 83, 88, 47, 40, 195, 184, 181, 114, 93, 83, 84, 61, 54, 143, 92, 81, 31, 8, 8, 134, 81, 67, 176, 123, 110, 94, 56, 38, 56, 31, 25, 128, 79, 62, 148, 93, 78, 180, 125, 111, 37, 22, 20, 185, 128, 123, 74, 43, 30, 170, 113, 89, 110, 60, 46, 188, 125, 101, 179, 113, 92, 209, 151, 134, 120, 68, 54, 59, 17, 13, 126, 74, 53, 191, 137, 123, 200, 161, 147, 168, 107, 87, 161, 103, 83, 102, 62, 47, 134, 102, 90, 149, 114, 99, 107, 59, 43, 54, 26, 18, 59, 29, 23, 69, 41, 32, 149, 108, 97, 237, 212, 203], this.p = s, this.boundary = i; for (let t = 0; t < this.data.length; t += 3) { const i = this.p.random_num(-.001, .001); this.vBlocks.push(new r.VerletNode(s, new h.default.Vector(this.data[t], this.data[t + 1], this.data[t + 2]), new h.default.Vector(.01 + i, .09 / 16 + i, .09 / 16 + i), s.color(this.cols[t] + this.p.int(this.p.random_num(-15, 15)), this.cols[t + 1] + this.p.int(this.p.random_num(-15, 15)), this.cols[t + 2] + this.p.int(this.p.random_num(-15, 15))))) } for (let s = 0, t = 0; s < this.vBlocks.length; s++)for (let i = s; i < this.vBlocks.length; i++)t++ % this.p.int(this.p.random_num(1, 4)) == 0 && s !== i && this.vSticks.push(new e.VerletStick(this.p, this.vBlocks[s], this.vBlocks[i], this.p.random_num(6e-4, .001))); this.nudge() } draw() { for (let s = 0; s < this.vBlocks.length; s++)this.vBlocks[s].verlet(), this.vBlocks[s].draw(), this.vBlocks[s].boundsCollide(this.boundary); for (let s = 0; s < this.vSticks.length; s++)this.vSticks[s].constrainLen(); this.p.frameCount % 1 == 0 && this.vBlocks[this.p.int(this.p.random_num(this.vBlocks.length))].nudge(new h.default.Vector(this.p.random_num(-.01, .01), this.p.random_num(-.01, .01), this.p.random_num(-.01, .01))) } nudge() { for (let s = 0; s < this.vBlocks.length; s++)this.vBlocks[s].nudge(new h.default.Vector(this.p.random_num(-.02, .02), this.p.random_num(-.02, .02), this.p.random_num(-.02, .02))) } } }, 222: function (s, t, i) { var o = this && this.__importDefault || function (s) { return s && s.__esModule ? s : { default: s } }; Object.defineProperty(t, "__esModule", { value: !0 }); const h = o(i(472)), e = i(413); new h.default((s => { let t, i, o, r, a, n = s.windowHeight, d = 9 * n / 16, p = s.int(s.random_num(0, 45)), l = s.int(s.random_num(0, 45)), u = s.int(s.random_num(0, 45)); s.setup = () => { s.pixelDensity(1), t = "#" + s.hex(u, 2) + s.hex(p, 2) + s.hex(l, 2), s.background(u, p, l), document.body.style.backgroundColor = t, document.title = "CryptoIra", n = s.windowHeight, d = 9 * n / 16; let c = s.createCanvas(d, n, s.WEBGL); r = new h.default.Vector(9 / 16, 1, .3), s.setAttributes("antialias", !0), c.style("display", "block"), i = s.createVector(0, 0, 300), s.noStroke(), o = new e.CryptoIra(s, 30, r), a = s.random_num(0, 150) }, s.draw = () => { s.background(u, p, l), s.orbitControl(); let t = s.createVector(i.x, i.y, i.z); s.ambientLight(100, 100, 100), s.directionalLight(175, 175, 175, t), s.shininess(10), s.specularColor(255), s.specularMaterial(100), s.pointLight(255, 255, 255, -100, -100, 200), s.pointLight(s.random_num(30, 60), s.random_num(30, 60), s.random_num(30, 90), 600 * s.sin(s.frameCount * s.PI / 90), 500 * s.cos(s.frameCount * s.PI / 90), 380), s.scale(new h.default.Vector(d, n, (n + d) / 2)), o.draw() }, s.keyTyped = () => { if ("p" === s.key) { const t = "CryptoIra_" + s.year() + s.month() + s.day() + s.hour() + s.minute() + s.second() + ".png"; s.save(t) } }, s.mousePressed = () => { o.nudge() } })) }, 472: s => { s.exports = p5 } }, t = {}; !function i(o) { var h = t[o]; if (void 0 !== h) return h.exports; var e = t[o] = { exports: {} }; return s[o].call(e.exports, e, e.exports, i), e.exports }(222) })();
};



const functionArray = [];

for (let i = minFiles; i <= maxFiles; i++) {
    const functionName = "_" + ("0" + i).slice(-2);
    functionArray.push(window[functionName]);
}

if (SEED >= 0 && SEED < functionArray.length) {
    const selectedFunction = functionArray[SEED];
    selectedFunction();
} else {
    console.log("Invalid selection");
}