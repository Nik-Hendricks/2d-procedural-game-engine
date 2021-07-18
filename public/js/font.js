


class Font{
    constructor(src, charmap){
        this.charmap = charmap;
        this.fontImage = new Image();
        this.fontImage.src = src;
    }



    drawChar(charCode, posX, posY, color, context){
        //console.log(`charcode: ${charCode} posX ${posX} posY ${posY} context ${context}`)
        if(charCode != ' '){
            var scopeX = 16 * this.charmap[charCode].position[0]
            var scopeY = 16 * this.charmap[charCode].position[1]
            context.ctx.drawImage(this.fontImage, scopeX, scopeY, 16 , 16 , posX, posY, context.fontX, context.fontY);
        }
        
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
