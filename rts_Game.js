//Game
function Game(){
	//tableau de coordonnées des unités
	this.tCoordUnit=Array();
	//tableau de corrdonnées des batiments/arbres/mine d'or
	this.tCoordBuild=Array();
	//le mode en cours 
	this.mode='';
	//l'element selectionné (unité/batiment...)
	this.tSelected=new Array();
	//le batiment selectionné à construire
	this.buildcreation='';
	//le tableau des cases visibles sur la carte
	this.tVisible=Array();
	//tableau contenant tous les batiments (utilisé pour reconstruire la map lors d'un scroll)
	this.tBuild=Array();
	//idem pour les unités
	this.tUnit=Array();
	
	this.shiftClicked=0;
	
	//ressources
	this.iOr=250;
	this.iWood=150;
}
Game.prototype={
	drawDirection:function(){
		oLayer_cadre.clear();
		//left
		oLayer_cadre.drawRect(0,0,10,oLayer_map.height,'#eeaf17','#eeaf17');
		//right
		oLayer_cadre.drawRect(oLayer_map.width-10,0,10,oLayer_map.height,'#eeaf17','#eeaf17');
		//bottom
		oLayer_cadre.drawRect(0,oLayer_map.height-10,100,10,'#eeaf17','#eeaf17');
		oLayer_cadre.drawRect(500,oLayer_map.height-10,300,10,'#eeaf17','#eeaf17');
		//top
		oLayer_cadre.drawRect(0,0,oLayer_map.width,10,'#eeaf17','#eeaf17');
	},
	goLeft:function(){
		if(currentX-1 < 0){
			return ;
		}
		
		currentX-=1;
		this.rebuild();
		oLayer_cadre.drawRect(0,0,10,oLayer_map.height,'#eeaf17','#eeaf17');
	},
	goRight:function(){
		if(currentX+1+maxX > map.tMap[0].length){
			return ;
		}
		
		currentX+=1;
		this.rebuild();
		oLayer_cadre.drawRect(oLayer_map.width-10,0,10,oLayer_map.height,'#eeaf17','#eeaf17');
	},
	goDown:function(){
		if(currentY+1+maxY > map.tMap.length){
			return ;
		}
		
		currentY+=1;
		this.rebuild();
		oLayer_cadre.drawRect(0,oLayer_map.height-10,100,10,'#eeaf17','#eeaf17');
		oLayer_cadre.drawRect(500,oLayer_map.height-10,300,10,'#eeaf17','#eeaf17');
	},
	goUp:function(){
		if(currentY-1 < 0){
			return ;
		}
		
		currentY-=1;
		this.rebuild();
		oLayer_cadre.drawRect(0,0,oLayer_map.width,10,'#eeaf17','#eeaf17');
	},
	rebuild:function(){
		map.rebuild();
		map.buildApercuCadre();
		
		oLayer_building.clear();
		for(var i=0;i< this.tBuild.length;i++){
			this.tBuild[i].build();
		}
		oLayer_perso.clear();
		for(var i=0;i< this.tUnit.length;i++){
			this.tUnit[i].build();
		}
		this.displayVisibility();
	},
	displayVisibility:function(){
		oLayer_brouillard.clear();
		oLayer_brouillard.drawRect(0,0,oLayer_map.width,oLayer_map.height,'#222222','#000000');
		for(var y=0;y< maxY;y++){
			for(var x=0;x<maxX;x++){
				if(this.tVisible[y+currentY] && this.tVisible[y+currentY][x+currentX] ){
					oLayer_brouillard.clearRect((x 	)*widthCase,(y)*heightCase,widthCase,heightCase);
				}
			}
		}
	},
	setVisibility:function(x,y){
		
		for(var i=-2;i<3;i++){
			if(!this.tVisible[y+i]){
				this.tVisible[y+i]=Array();
			}
			
			for(var j=-2;j<3;j++){
	
				this.tVisible[y+i][x+j]=1;
				
				map.setVisibility(x+j,y+i);
			}
		}
		
		
	},
	checkCoord:function(x,y){
		y=parseInt(y+0);
		x=parseInt(x+0);
		if(this.tCoordBuild[ y ] && this.tCoordBuild[ y ][ x ] && this.tCoordBuild[ y ][ x ]!=''){
			console.log('not libre tCoordBuild[ '+y+' ][ '+x+' ]');
			return false;
		}
		
		if(this.tCoordUnit[ y ] && this.tCoordUnit[ y ][ x ] && this.tCoordUnit[ y ][ x ]!=''){
			console.log('not libre tCoordUnit[ '+y+' ][ '+x+' ]');
			return false;
		}
		
		if(map.tMap[y] && map.tMap[y][x] && map.tMap[y][x]==3){
		
			return true;
			
		}
		return false;

	},
	checkCoordVisible:function(x,y){
		y=parseInt(y+0);
		x=parseInt(x+0);
		if(this.tVisible[ y ] && this.tVisible[ y ][ x ] && this.tVisible[ y ][ x ]==1){
			console.log('visible visible tVisible[ '+y+' ][ '+x+' ]');
			return true;
		}
		return false;
	},
	getXmouse:function(e){
		if(e && e.x!=null && e.y!=null){
			return e.x +document.body.scrollLeft;
		}else{
			return e.clientX +document.body.scrollLeft;
		}
	},
	getYmouse:function(e){
		if(e && e.x!=null && e.y!=null){
			return e.y + document.body.scrollTop;
		}else{
			return e.clientY + document.body.scrollTop;
		}
	},
	getX:function(e){
		var x=this.getXmouse(e);
		x=parseInt( x/widthCase);
	
		return x+currentX;
	},
	getY:function(e){
		var y=this.getYmouse(e);
		y=parseInt( y/widthCase);
		
		return y+currentY;
	},
	
	getXApercu:function(e){
		var x=this.getXmouse(e)-600;
		x=parseInt( x/map.miniWidth);
	
		return x;
	},
	getYApercu:function(e){
		var y=this.getYmouse(e)-422;
		y=parseInt( y/map.miniWidth);
		
		return y;
	},
	
	isWalkable:function(x,y){
		if(this.tCoordBuild[y] && this.tCoordBuild[y][x] && this.tCoordBuild[y][x]!=''){
			return false;
		}
		
		if(this.tCoordUnit[y] && this.tCoordUnit[y][x] && this.tCoordUnit[y][x]!=''){
			return false;
		}
		return true;
	},
	goto:function(x,y){
		//recuperation de batiment sur ces coordonnées
		var aBuild=this.getBuild(x,y);

		//si une unité est sélectionnée et que le batiment cliqué est une mine ou du bois
		if(this.tSelected.length && aBuild && ( aBuild.name=='or' || aBuild.name=='wood' )){
			//on créé une ronde du bois/or vers le QG
			//pour alimenter les ressources Or/bois
			
			for(var i=0;i<this.tSelected.length;i++){
			
				//on indique que la destination de cycle c'est la mine d'or ou l'arbre
				this.tSelected[i].cycleToX=x;
				this.tSelected[i].cycleToY=y;

				//on indique que la provenance du cycle c'est le QG
				this.tSelected[i].cycleFromX=QGx;
				this.tSelected[i].cycleFromY=QGy;

				//on donne comme cible de deplacement la mine d'or/l'arbre cliqué
				this.tSelected[i].setTarget(x,y);
			}
		}else if(this.isWalkable(x,y) && this.tSelected.length){
			for(var i=0;i <this.tSelected.length;i++){
				//si la case est accessible, on y indique à l'unité d'y aller
				this.tSelected[i].setTarget(x,y);
			}
		}
	},
	//appelé lors d'un clic droit sur le canvas (pour un deplacement d'unité)
	clickdroit:function(e){
		//recuperation des coordonnées "tableau" x y
		var x=this.getX(e);
		var y=this.getY(e);

		this.goto(x,y);
		return false;

	},
	clickdroitApercu:function(e){
		//recuperation des coordonnées "tableau" x y
		var x=this.getXApercu(e);
		var y=this.getYApercu(e);
		
		this.goto(x,y);
		return false;
	},
	clickApercu:function(e){
		//recuperation des coordonnées "tableau" x y
		var x=this.getXApercu(e);
		var y=this.getYApercu(e);
		
		currentX=x-(maxX/2);
		currentY=y-(maxY/2);
		
		if(currentX < 0 ){ currentX=0;}
		if(currentY < 0 ){ currentY=0;}
		
		sDirection='refresh';
	},
	//appelée lors d'un clic gauche sur le canvas (sélection d'une unité/batiment)
	click:function(e){
		//recuperation des coordonnées "tableau" x y
		var x=this.getX(e);
		var y=this.getY(e);
		
		
		//si l'utilisateur a séléctionné un batiment à construire
		if(this.buildcreation!=''){
			
			//on veririfie ensuite les coordonnées 
			//des 4 cases nécéssaires à la construction du batiment
			var ok=1;
			if(!oGame.checkCoordVisible(x,y) || !oGame.checkCoord(x,y) ){
				ok=0;
			}else if(!oGame.checkCoordVisible(x+1,y) || !oGame.checkCoord(x+1,y) ){
				ok=0;
			}else if(!oGame.checkCoordVisible(x,y+1) || !oGame.checkCoord(x,y+1) ){
				ok=0;
			}else if(!oGame.checkCoordVisible(x+1,y+1) || !oGame.checkCoord(x+1,y+1) ){
				ok=0;
			}
			
			if(!ok){
				//si une des cases indisponible, on annule
				return;
			}
			
			//si c'est ok, on efface la selection d'emplacement
			this.buildcreation.clear();
			//on indique à l'unité qui doit construire
			//le batiment à construire
			this.tSelected[0].buildOn(this.buildcreation);
			
			//on annule la construction en cours
			this.buildcreation='';
			
			return;
			 
		} 
		
		//on recherche si il y a quelquechose aux coordonnées
		var oUnit=this.getUnit(x,y);
		var oBuild=this.getBuild(x,y);
		
		//si il y a une unité
		if(oUnit){
			//si la touche shift n'est pas cliqué en efface le tableau de sélection
			if(!this.shiftClicked){
				this.clearSelect();
			}
			//on selectionne celle-ci
			this.select(oUnit);
		}else if(oBuild){
			this.clearSelect();
			//si  il y a un batiment,
			//on le selectionne
			this.select(oBuild);
		}else{
			//sinon on supprime la selection sur le canvas
			console.log('pas trouve');
			this.clearSelect();
		}
	},
	keydown:function(e){
		var touche = e.keyCode;

		//si shirt, on enregistre que shift est pressé
		if(touche==16){
			this.shiftClicked=1;
		}
	},
	keyup:function(e){
		this.shiftClicked=0;
	},
	saveBuild:function(oBuild){
        //on recupere les coordonnées du batiment 
        var y=parseInt(oBuild.y);
        var x=parseInt(oBuild.x);
            
		//on enregistre dans un tableau indexé
		//les nouvelles coordonnées
		if(!this.tCoordBuild[y]){
			this.tCoordBuild[y]=Array();
		}
		
		if(oBuild.name=='wood'){
			//si c'est un arbre: on prend qu'une case pas 4
			this.tCoordBuild[y][x]=oBuild;
			return;
		}
		
		
		if(!this.tCoordBuild[y+1]){
			this.tCoordBuild[y+1]=Array();
		}
		this.tCoordBuild[y][x]=oBuild;
		this.tCoordBuild[y+1][x]=oBuild;
		this.tCoordBuild[y+1][x+1]=oBuild;
		this.tCoordBuild[y][x+1]=oBuild;
		
	},
	clearBuild:function(oBuild){
		var y=oBuild.y;
		var x=oBuild.x;
		
		this.tCoordBuild[y][x]='';
	},
	getBuild:function(x,y){
		if(this.tCoordBuild[y] &&  this.tCoordBuild[y][x]){
			return this.tCoordBuild[y][x];
		}
		return null;
	},
	clearUnit:function(oUnit){
		
		var y=oUnit.y;
		var x=oUnit.x;
		
		
		this.tCoordUnit[y][x]='';
		//console.log('saveUnit '+y+' '+x);
		
		this.setVisibility(x,y);
	},
	saveUnit:function(oUnit){
		//on recupere les coordonnées de l'unité
		var y=oUnit.y;
		var x=oUnit.x;
		
		//on enregistre dans un tableau indexé
		//les nouvelles coordonnées
		if(!this.tCoordUnit[y]){
			this.tCoordUnit[y]=Array();
		}
		this.tCoordUnit[y][x]=oUnit;
		
		//on rend la zone visible
		this.setVisibility(x,y);
	},
	getUnit:function(x,y){
		//console.log('search x:'+x+' '+y);
		if(this.tCoordUnit[y] &&  this.tCoordUnit[y][x]){
			return this.tCoordUnit[y][x];
		}
		return null;
	},
	chooseMove:function(){
		this.mode='move';
	},
	clearSelect:function(){
		//on efface le calque
		oLayer_select.clear();
		this.tSelected=new Array();
		//on efface le bloc du bas
		this.resetNav();
	},
	select:function(oMix){
		//on enregistre l'unité/batiment
		this.tSelected.push(oMix);
		
		//on demande son dessin
		this.drawSelected();
		
		//on affiche la navigation
		oMix.buildNav();
	},
	drawSelected:function(){
		//on efface le calque
		oLayer_select.clear();
		
		for(var i=0;i<this.tSelected.length;i++){
			//on dessine un cadre sur un des calques au dimension de l'élement
			oLayer_select.drawRectStroke((this.tSelected[i].x-currentX)*widthCase,(this.tSelected[i].y-currentY)*heightCase,this.tSelected[i].width,this.tSelected[i].height,'#880044',3);
		}
	},
	resetNav:function(){
		getById('nav').innerHTML='';
	},
	refreshBuild:function(){
		for(var i=0;i< this.tBuild.length;i++){
			var oBuild= this.tBuild[i];
			if(oBuild.level < 0){
				
				oBuild.sSprite='_'+oBuild.level;
				oBuild.build();
				oBuild.level++;
			}else if(oBuild.sSprite!=''){
				oBuild.sSprite='';
				oBuild.build();
			}
		
		}
	},
	refreshUnit:function(){
		
		//on boucle sur les unités existantes
		for(var i=0;i< this.tUnit.length;i++){
			var oUnit= this.tUnit[i];
			
			//si l'unité doit se rendre quelques part
			if(oUnit.targetX!='' && oUnit.targetY!='' && (oUnit.targetX!=oUnit.x || oUnit.targetY!=oUnit.y) ){
			
				var vitesse=1;
				var vitesse2=vitesse*-1;
				
				//on efface le dessin sur le calques
				oUnit.clear();
				
				var lastX=oUnit.x;
				var lastY=oUnit.y;
				
				//on initialise les nouvelles coordonnées
				var newX=oUnit.x;
				var newY=oUnit.y;
				
				//on fait evoluer les coordonnées vers la destination
				if(oUnit.targetX!='' && oUnit.x < oUnit.targetX ){
					newX+=vitesse;
				}else if(oUnit.targetX!='' && oUnit.x > oUnit.targetX ){
					newX-=vitesse;
				}
				if(oUnit.targetY!='' && oUnit.y < oUnit.targetY ){
					newY+=vitesse;
				}else if(oUnit.targetY!='' && oUnit.y > oUnit.targetY ){
					newY-=vitesse;
				}
				
				//on verifie si aux coordonnées cible, il y a un batiment
				var aBuild=this.getBuild(newX,newY);
				
				//si la cible est le QG et que l'on est en "ronde"
				if(aBuild && aBuild.name=='QG' && oUnit.cycleToX!=''){
					oUnit.x=newX;
					oUnit.y=newY;
					
					//on definit la nouvelle cible
					oUnit.setTarget(oUnit.cycleToX,oUnit.cycleToY);
					
					//si l'unité transportait de l'or
					if(oUnit.or >0){
						//on ajoute une ressource or
						this.addRessourceOr(oUnit.or);
					}else 	if(oUnit.wood >0){
						//idem pour le bois
						this.addRessourceWood(oUnit.wood);
					}

					//on reset les ressources de l'unité
					oUnit.or=0;
					oUnit.wood=0;
				
				//si la cible c'est un arbre et que le compteur est inferieur à N
				}else if(aBuild && aBuild.name=='wood' && oUnit.counter < 8  && oUnit.cycleToX!=''){
					
					//on met en place un compteur 
					//pour que la ressources mette du temps
					//a recuperer la ressource
					oUnit.counter+=1;
					
					oUnit.build();
					
					continue;
					
				//si le compteur est superieur à N
				}else if(aBuild && aBuild.name=='wood' && oUnit.counter >= 8 && oUnit.cycleToX!=''){
					//on indique à l'unité qu'elle transporte 10
					oUnit.wood=10;
					
					//a chaque iteration on decremente la ressource
					aBuild.ressource-=10;
					//si l'arbre est épuisé, on le supprime de la carte
					if(aBuild.ressource<=0){
						aBuild.clear();
					}
					
					oUnit.x=newX;
					oUnit.y=newY;
					
					//on remet le compteur à 0
					oUnit.counter=0;
					
					//on redéfinit la nouvelle cible (c'est un cycle)
					oUnit.setTarget(oUnit.cycleFromX,oUnit.cycleFromY);
				
				//si la cible c'est une mine d'or et que le compteur est inferieur à N
				}else if(aBuild && aBuild.name=='or' && oUnit.counter < 8  && oUnit.cycleToX!=''){
					//on met en place un compteur 
					//pour que la ressources mette du temps
					//a recuperer la ressource
					oUnit.counter+=1;
					
					continue;
				//si le compteur est superieur à N
				}else if(aBuild && aBuild.name=='or' && oUnit.counter >= 8  && oUnit.cycleToX!=''){
					//on indique à l'unité qu'elle transporte 10
					oUnit.or=10;
					
					oUnit.x=newX;
					oUnit.y=newY;
					
					//on remet le compteur à 0
					oUnit.counter=0;
					
					//on redéfinit la nouvelle cible (c'est un cycle)
					oUnit.setTarget(oUnit.cycleFromX,oUnit.cycleFromY);
					
				}else if(this.checkCoord(newX,newY)){
					//si la coordonnées est libre
					oUnit.x=newX;
					oUnit.y=newY;
				}else if(this.checkCoord(oUnit.x,newY)){
					//si la coordonnées est libre (cas d'un evitement d'obstacle)
					oUnit.y=newY;
				}else if(this.checkCoord(newX,oUnit.y)){
					//si la coordonnées est libre (cas d'un evitement d'obstacle)
					oUnit.x=newX;
				}else if(this.checkCoord(newX,oUnit.y)){
					//si la coordonnées est libre (cas d'un evitement d'obstacle)
					oUnit.x=newX;
				}else if(this.checkCoord(oUnit.x+vitesse2,oUnit.y)){
					//si la coordonnées est libre (cas d'un evitement d'obstacle)
					oUnit.x=oUnit.x+vitesse2;
				}else if(this.checkCoord(oUnit.x,oUnit.y+vitesse2)){
					//si la coordonnées est libre (cas d'un evitement d'obstacle)
					oUnit.y=oUnit.y+vitesse2;
				}
				
				//on dessine l'unité
				oUnit.build();
				
				//si la position n'est pas differente d'avant le calcul: l'unite est bloque, on annule sa cible
				if(lastX==oUnit.x && lastY==oUnit.y){
					oUnit.clearTarget();
				}
				
				console.log('recalcul');
				//on met à jour la partie visible de la carte
				oGame.displayVisibility();
			}
		
		}
		
		//on redessine le cadre de selection
		this.drawSelected();
		
	},
	createBuild:function(name){
		var oBuildcreation = new Buildcreation(name);
		oBuildcreation.build();
		
		this.buildcreation=oBuildcreation;
		 
	},
	mousemove:function(e){
		sDirection='';
		if(this.buildcreation){
			//si une construction est en cours
		
			//on recupere les coordonnées
			var x=this.getX(e);
			var y=this.getY(e);
			
			//on efface la derniere position de la construction théorique
			this.buildcreation.clear();
			//on deplace le plan aux nouvelles coordonnées
			this.buildcreation.x=x;
			this.buildcreation.y=y;
			//on affiche le plan
			this.buildcreation.build();
		}else if(this.getYmouse(e) < 5){
			//si les coordonnées y sont inferieur à 5: 
			//scroll de la map vers le haut
			sDirection='up';
		}else if(this.getYmouse(e) > (oLayer_map.height-10) && this.getYmouse(e) < oLayer_map.height-1 && (this.getXmouse(e) < 100 || this.getXmouse(e) > 500)){
			//ici on verifie plusieurs choses pour laisser un passage vers le bas
			//vous pouvez voir ces zones de selection en orange
			//si c'est le cas, scroll de la map vers le bas
			sDirection='down';
		}else if(this.getXmouse(e) < 5){
			//si les coordonnées x sont inferieur à 5: 
			//scroll de la map vers la gauche
			sDirection='left';
		}else if(this.getXmouse(e) > (oLayer_map.width-10)){
			//si les coordonnées x sont superieur à la largeur de la map -10: 
			//scroll de la map vers la droite
			sDirection='right';
		}
		
	},
	addRessourceOr:function(nb){
		this.iOr+=nb;
		this.buildRessource();
	},
	addRessourceWood:function(nb){
		this.iWood+=nb;
		this.buildRessource();
	},
	
	
	buildRessource:function(){
		var a=getById('menu');
		if(a){
			var sHtml='';
			sHtml+='<span style="background:yellow;padding:0px 4px">&nbsp;</span>';
			sHtml+=' Or: '+this.iOr;
			sHtml+=' <span style="padding:0px 10px">&nbsp;</span>';
			sHtml+='<span style="background:brown;padding:0px 4px">&nbsp;</span>';
			sHtml+=' Bois: '+this.iWood;
			a.innerHTML=sHtml;
		}
	},
};
