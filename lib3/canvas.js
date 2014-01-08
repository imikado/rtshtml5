//CANVAS
function Canvas(id){
    this.canvas = document.getElementById(id);
    if(!this.canvas){
		alert('cannot find "'+id+'"');
	}
    
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.fill_color = "#FFF";
    this.stroke_color = "#000";
}
Canvas.prototype={
	
	isInside: function(pos) {
		return true;
		//return (pos.x >= 0 && pos.x<=this.width && pos.y>=0 && pos.y<=this.height);
	},

	clear: function(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	},
	clearRect: function(x,y,width,height){
		this.ctx.clearRect(x, y,  width, height);
	},
	circle: function(p,r){
		x = p.x*this.width;
		y = p.y*this.height;
		//this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.stroke_color;
		this.ctx.moveTo(x+r,y);
		this.ctx.arc(x,y,r,0,TWO_PI,false);
		this.ctx.fill();
		//this.ctx.restore();
	},
	line: function(x1,x2){
		//this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.stroke_color;
		this.ctx.moveTo(x1.x*this.width,x1.y*this.height);
		this.ctx.lineTo(x2.x*this.width,x2.y*this.height);
		this.ctx.stroke();
		//this.ctx.restore();
	}
	,
	drawRect : function(x,y,ilargeur,ihauteur,contour,fond){

		this.ctx.beginPath();

		this.ctx.lineWidth=1;
		this.ctx.strokeStyle=contour;
		this.ctx.fillStyle=fond;
		this.ctx.fillRect(x,y,ilargeur,ihauteur);
		this.ctx.strokeRect(x,y,ilargeur,ihauteur);
		this.ctx.closePath();

	},
	fillRect : function(x,y,ilargeur,ihauteur,fond){

		this.ctx.beginPath();

		this.ctx.lineWidth=0;
		 
		this.ctx.fillStyle=fond;
		this.ctx.fillRect(x,y,ilargeur,ihauteur);
		this.ctx.closePath();

	},
	drawRectStroke : function(x,y,ilargeur,ihauteur,contour,width){

		this.ctx.beginPath();

		this.ctx.lineWidth=width;
		this.ctx.strokeStyle=contour;
		 
		this.ctx.strokeRect(x,y,ilargeur,ihauteur);
		this.ctx.closePath();

	}
	,
	fillText:function(x,y,texte,couleur){
		this.ctx.textBaseline = 'top';
		this.ctx.fillStyle=couleur;
		this.ctx.fillText(texte,x,y);
	}
	,
	drawLosange: function (x,y,ilargeur,ihauteur,couleur,fond){

		// fond='#222222';

		this.ctx.lineWidth=1;
		if(couleur!='#000000'){
			this.ctx.lineWidth=2;

		}

		this.ctx.beginPath();
		this.ctx.moveTo(x,y+(ihauteur/2) );

		//_context.closePath();
		this.ctx.lineTo(x+(ilargeur/2),y);
		this.ctx.lineTo(x+(ilargeur/1),y+(ihauteur/2));
		this.ctx.lineTo(x+(ilargeur/2),y+(ihauteur/1));
		this.ctx.lineTo(x,y+(ihauteur/2));


		this.ctx.strokeStyle = couleur;
		this.ctx.stroke();

		this.ctx.fillStyle=fond;
		this.ctx.fill();

		this.ctx.closePath();


	}
	,
	drawImage: function (img,x,y,width,height){
		this.ctx.drawImage(img,x,y ,width,height  );
	}
	,
	drawImage2: function (img,x,y,width,height,x2,y2,width2,height2){
		this.ctx.drawImage(img,x,y ,width,height,x2,y2,width2,height2  );
	}
	,
	isInThisLosange: function(x,y){

	},
	
};
