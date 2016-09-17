var current_pieces=[[],[],[],[],[],[],[],[]];
var current_colors=[[],[],[],[],[],[],[],[]];
var lastclicked=0;
var lastmove=[];
var turn='WH';
var whitechallenges=[];
var blackchallenges=[];

var kingpos={'WH':[0,4],'BL':[7,4]};

var whiteoncheck=false;
var blackoncheck=false;

current_pieces[0]=['R','N','B','Q','K','B','N','R'];
current_pieces[1]=['P','P','P','P','P','P','P','P'];
current_pieces[2]=[0,0,0,0,0,0,0,0];
current_pieces[3]=[0,0,0,0,0,0,0,0];
current_pieces[4]=[0,0,0,0,0,0,0,0];
current_pieces[5]=[0,0,0,0,0,0,0,0];
current_pieces[6]=['P','P','P','P','P','P','P','P'];
current_pieces[7]=['R','N','B','Q','K','B','N','R'];

current_colors[0]=['WH','WH','WH','WH','WH','WH','WH','WH'];
current_colors[1]=['WH','WH','WH','WH','WH','WH','WH','WH'];
current_colors[2]=[0,0,0,0,0,0,0,0];
current_colors[3]=[0,0,0,0,0,0,0,0];
current_colors[4]=[0,0,0,0,0,0,0,0];
current_colors[5]=[0,0,0,0,0,0,0,0];
current_colors[6]=['BL','BL','BL','BL','BL','BL','BL','BL'];
current_colors[7]=['BL','BL','BL','BL','BL','BL','BL','BL'];

function arrclone(arr){return JSON.parse(JSON.stringify(arr));}

function arrsearch(parent,child){
	for(pi=0;pi<parent.length;pi++)
	{
		var flag=true;
		for(ci=0;flag&&ci<child.length;ci++)
		{
			if(parent[pi][ci]!=child[ci])flag=false;
		}
		if(flag)return pi;
	}
	return -1;
}

function initializepositions(){
	for(var i=0;i<8;i++)
	for(var j=0;j<8;j++)
	{
		var piece=current_pieces[i][j];
		var color=current_colors[i][j];
		if(piece!=0){
			var aone=zerozerotoaone([i,j]);
			$('#'+aone).addClass(piece);
			$('#'+aone).addClass(color);
		}
	}
}

function challenges(pieces,colors){
	whitechallenges=[];
	blackchallenges=[];
	for(var i=0;i<8;i++)
	for(var j=0;j<8;j++)
	{
		if(colors[i][j]!=0){
			var moves=getmoves([i,j],true,pieces,colors);
			if(colors[i][j]=='WH')
				for(c in moves)
					whitechallenges.push(moves[c]);
			if(colors[i][j]=='BL')
				for(c in moves)
					blackchallenges.push(moves[c]);
		}
		
	}
}

function showchallenges(color){
	$('.blackchallenge').removeClass('blackchallenge');
	$('.whitechallenge').removeClass('whitechallenge');
	if(color=='WH')	
	for(k in whitechallenges)
	{
		var m_id=zerozerotoaone(whitechallenges[k]);
		$("#"+m_id).addClass('whitechallenge');
	}
	if(color=='BL')
	for(k in blackchallenges)
	{
		var m_id=zerozerotoaone(blackchallenges[k]);
		$("#"+m_id).addClass('blackchallenge');
	}
}

function aonetozerozero(aone){
	var chars=['a','b','c','d','e','f','g','h'];
	var zz=aone.split('');
	zz[0]=chars.indexOf(zz[0]);
	zz[1]--;
	if(!isvalid(zz))return false;
	return zz;
}

function zerozerotoaone(zz){
	var chars=['a','b','c','d','e','f','g','h'];
	if(!isvalid(zz))return false;
	return chars[zz[0]]+''+(zz[1]+1);
}

function isvalid(zz){ 
	if(zz[0]>7||zz[0]<0||zz[1]>7||zz[1]<0)return false;
	else return true;
}

function cellclick(){
	var zz=aonetozerozero(this.id);
	if($(this).hasClass('highlight')){ // User clicked a highlighted cell
		var lastzz=aonetozerozero(lastclicked);
		var lastpiece=current_pieces[lastzz[0]][lastzz[1]];
		var lastcolor=current_colors[lastzz[0]][lastzz[1]];
		current_pieces[lastzz[0]][lastzz[1]]=0;
		current_colors[lastzz[0]][lastzz[1]]=0;
		current_pieces[zz[0]][zz[1]]=lastpiece;
		current_colors[zz[0]][zz[1]]=lastcolor;
		if(lastpiece=='K')kingpos[lastcolor]=zz;

		turn=turn=='WH'?'BL':'WH'; // Swap the turn
		lastmove=[lastclicked,this];
	
		$('#'+lastclicked).removeClass('BL').removeClass('WH').removeClass(lastpiece);
		$(this).removeClass('BL').removeClass('WH').removeClass('P').removeClass('R').removeClass('N').removeClass('B').removeClass('Q').removeClass('K').addClass(lastcolor).addClass(lastpiece);
		$('.highlight').removeClass('highlight'); // Remove current highlightings
		return;
	}
	$('.highlight').removeClass('highlight'); // Remove current highlightings

	if(current_colors[zz[0]][zz[1]]!=turn)return;
	var possiblemoves=getmoves(zz,false,current_pieces,current_colors);
	lastclicked=this.id;	

	var validmoves=[];//possiblemoves;
	for(var pm=0;pm<possiblemoves.length;pm++)
	{
		var futurepieces=arrclone(current_pieces);
		var futurecolors=arrclone(current_colors);
		futurecolors[possiblemoves[pm][0]][possiblemoves[pm][1]]=futurecolors[zz[0]][zz[1]];
		futurecolors[zz[0]][zz[1]]=0;
		futurepieces[possiblemoves[pm][0]][possiblemoves[pm][1]]=futurepieces[zz[0]][zz[1]];
		futurepieces[zz[0]][zz[1]]=0;
		challenges(futurepieces,futurecolors);
		var kingposition=futurepieces[possiblemoves[pm][0]][possiblemoves[pm][1]]=='K'?[possiblemoves[pm][0],possiblemoves[pm][1]]:kingpos[turn];
		if(turn=='WH'&&arrsearch(blackchallenges,kingposition)<0)validmoves.push(possiblemoves[pm]);
		if(turn=='BL'&&arrsearch(whitechallenges,kingposition)<0)validmoves.push(possiblemoves[pm]);
	}

	for(var vm=0;vm<validmoves.length;vm++)
	{
		var m_id=zerozerotoaone(validmoves[vm]);
		$("#"+m_id).addClass('highlight');
	}
}

function getmoves(zz,challenge,pieces,colors){
	if(pieces[zz[0]][zz[1]]=='P')return getmoves_pawn(zz,challenge,pieces,colors);
	if(pieces[zz[0]][zz[1]]=='N')return getmoves_knight(zz,challenge,pieces,colors);
	if(pieces[zz[0]][zz[1]]=='R')return getmoves_rook(zz,challenge,pieces,colors);
	if(pieces[zz[0]][zz[1]]=='B')return getmoves_bishop(zz,challenge,pieces,colors);
	if(pieces[zz[0]][zz[1]]=='Q')return getmoves_queen(zz,challenge,pieces,colors);
	if(pieces[zz[0]][zz[1]]=='K')return getmoves_king(zz,challenge,pieces,colors);
}

function getmoves_pawn(zz,challenge,pieces,colors){ // Logic for pawn.. TODO: En-passent move
	var dir=(colors[zz[0]][zz[1]]=='WH')?1:-1;
	var moves=[];
	if(!challenge)// This should not be calculated for challenges
	if(isvalid([zz[0]+dir,zz[1]])&&pieces[zz[0]+dir][zz[1]]==0){ // Forward cells
		moves.push([zz[0]+dir,zz[1]]);
		// Logic for the first 2 step movement
		if(isvalid([zz[0]+2*dir,zz[1]])&&pieces[zz[0]+2*dir][zz[1]]==0
				&&
				(
					(colors[zz[0]][zz[1]]=='WH'&&zz[0]==1)
					||
					(colors[zz[0]][zz[1]]=='BL'&&zz[0]==6)
				)
		)
			moves.push([zz[0]+2*dir,zz[1]]);
	}
	if(isvalid([zz[0]+dir,zz[1]-1])
		&&
		(
			challenge
			||
			colors[zz[0]+dir][zz[1]-1]!=0&&colors[zz[0]+dir][zz[1]-1]!=colors[zz[0]][zz[1]]
		)
	)
		moves.push([zz[0]+dir,zz[1]-1]);

	if(isvalid([zz[0]+dir,zz[1]+1])
		&&
		(
			challenge
			||
			colors[zz[0]+dir][zz[1]+1]!=0&&colors[zz[0]+dir][zz[1]+1]!=colors[zz[0]][zz[1]]
		)
	)
			moves.push([zz[0]+dir,zz[1]+1]);
	return moves;
}

function getmoves_knight(zz,challenge,pieces,colors){// Logic for Knight...
	var moves=[];
	var possibles=[];
	possibles.push([zz[0]+1,zz[1]+2]);
	possibles.push([zz[0]+1,zz[1]-2]);
	possibles.push([zz[0]-1,zz[1]+2]);
	possibles.push([zz[0]-1,zz[1]-2]);
	possibles.push([zz[0]+2,zz[1]+1]);
	possibles.push([zz[0]+2,zz[1]-1]);
	possibles.push([zz[0]-2,zz[1]+1]);
	possibles.push([zz[0]-2,zz[1]-1]);
	
	for(k in possibles){
		if(isvalid(possibles[k])
			&&
			(
				challenge
				||
				colors[possibles[k][0]][possibles[k][1]]!=colors[zz[0]][zz[1]]
			)
		)
			moves.push(possibles[k]);
	}
	return moves;
}

function getmoves_rook(zz,challenge,pieces,colors){// Logic for Rook
	var moves=[];
	var possible=[zz[0],zz[1]];
	var piecefound=false;

	do{
		possible[0]++;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]--;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[1]++;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[1]--;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	return moves;
}

function getmoves_bishop(zz,challenge,pieces,colors){// Logic for Bishop
	var moves=[];
	var possible=[zz[0],zz[1]];
	var piecefound=false;
	
	do{
		possible[0]++;possible[1]++;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]--;possible[1]--;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]--;possible[1]++;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]++;possible[1]--;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	return moves;
}

function getmoves_queen(zz,challenge,pieces,colors){// Logic for Queen
	var moves=[];
	var possible=[zz[0],zz[1]];
	var piecefound=false;
	
	do{
		possible[0]++;possible[1]++;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]--;possible[1]--;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]--;possible[1]++;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]++;possible[1]--;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]++;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[0]--;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[1]++;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	possible=[zz[0],zz[1]];piecefound=false;
	do{
		possible[1]--;
		if(isvalid(possible)&&(challenge||colors[possible[0]][possible[1]]!=colors[zz[0]][zz[1]])&&!piecefound)
			{
				moves.push([possible[0],possible[1]]);
				if(colors[possible[0]][possible[1]]!=0)piecefound=true;
			}
		else break;
	}while(true);

	return moves;
}

function getmoves_king(zz,challenge,pieces,colors){// Logic for King
	var moves=[];
	var possibles=[];
	possibles.push([zz[0]+1,zz[1]+1]);
	possibles.push([zz[0]+1,zz[1]-1]);
	possibles.push([zz[0]-1,zz[1]+1]);
	possibles.push([zz[0]-1,zz[1]-1]);
	possibles.push([zz[0]+1,zz[1]]);
	possibles.push([zz[0]-1,zz[1]]);
	possibles.push([zz[0],zz[1]+1]);
	possibles.push([zz[0],zz[1]-1]);
	
	for(k in possibles){
		if(isvalid(possibles[k])
			&&
			(
				challenge
				||
				colors[possibles[k][0]][possibles[k][1]]!=colors[zz[0]][zz[1]]
			)
		)
			moves.push(possibles[k]);
	}
	return moves;
}
$('body').onload=initializepositions();
$('td').click(cellclick);