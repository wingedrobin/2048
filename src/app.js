

"use strict" ;

var comp	= gxd.comp || { } ;
var def		= gxd.def || { } ;
var proj	= gxd.proj || { } ;

var MainScene = cc.Scene.extend(
{
	_mainLayer		: null ,
	_gameOverLayer	: null ,
	
	ctor : function( )
	{
		this._super( ) ;
		
		cc.loader.loadJson( "res/configuration.json" , this._onConfigJsonLoadedCallback.bind( this ) ) ;
	} ,
	
	_onConfigJsonLoadedCallback : function( error , json )
	{
		if( !error )
		{
			proj.config = json ;
			
			var backgroundLayer = new cc.LayerColor( cc.color( json[ "backgroundLayerColor" ] ) ,
													 cc.director.getWinSize( ).width ,
													 cc.director.getWinSize( ).height ) ;
			backgroundLayer.setPosition( 0 , 0 ) ;
			this.addChild( backgroundLayer , 1 ) ;
			
			this._mainLayer = new comp.WindowFrameLayer( cc.color( json[ "windowFrame" ][ "windowColor" ] ) ,
															 json[ "windowFrame" ][ "frameSize" ][ "width" ] ,
															 json[ "windowFrame" ][ "frameSize" ][ "height" ] ,
															 json[ "windowFrame" ][ "rows" ] ,
															 json[ "windowFrame" ][ "columns" ] ) ;
			
			this._mainLayer.setPosition( 160 , 0 ) ;
			this.addChild( this._mainLayer , 2 ) ;
		}
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( ) 
	{
		this._super( ) ;
	} ,
	
	gameOver : function( complete )
	{
		if( this._gameOverLayer )
			this.addChild( this._gameOverLayer , 10 ) ;
		else
		{
			// this._initGameOverLayer( complete ) ;
			this._gameOverLayer = new comp.GameOverLayer( cc.color( 255 , 237 , 151 , 150 ) ,
														  this._mainLayer.getContentSize( ).width ,
														  this._mainLayer.getContentSize( ).height ) ;
			
			this._gameOverLayer.setPosition( this._mainLayer.getPosition( ) ) ;
			this._gameOverLayer.retain( ) ;
			this.addChild( this._gameOverLayer , 10 ) ;
		}
		
		this._gameOverLayer.setGameCompleteState( complete ) ;
	} ,
	
	_initGameOverLayer : function( complete )
	{
		var mainLayerSize	= this._mainLayer.getContentSize( ) ;
		var message			= complete ? MainScene.completeMessage : MainScene.FailedMessage ;
		
		this._gameOverLayer = new comp.TouchBlockedLayer( cc.color( 255 , 237 , 151 , 150 ) ,
														  mainLayerSize.width ,
														  mainLayerSize.height ) ;
		
		var messageLabel	= new cc.LabelTTF( message , "Arial" , 100 ) ;
		messageLabel.setPosition( mainLayerSize.width * 0.5 ,
								  mainLayerSize.height * 0.5 ) ;
		
		var leaveButton		= new cc.MenuItemSprite( new cc.Sprite( res.leave_normal ) ,
													 new cc.Sprite( res.leave_selected ) ,
													 this._onLeaveCallback ,
													 this ) ;
		
		var tryAgainButton	= new cc.MenuItemSprite( new cc.Sprite( res.try_again_normal ) ,
													 new cc.Sprite( res.try_again_selected ) ,
													 this._onTryAgainCallback ,
													 this ) ;
		
		var menu			= new cc.Menu( leaveButton , tryAgainButton ) ;
		
		menu.alignItemsHorizontallyWithPadding( 50 ) ;
		menu.setPosition( mainLayerSize.width * 0.5 , mainLayerSize.height * 0.3 ) ;
		
		this._gameOverLayer.addChild( messageLabel ) ;
		this._gameOverLayer.addChild( menu ) ;
		this._gameOverLayer.setPosition( this._mainLayer.getPosition( ) ) ;
		this._gameOverLayer.retain( ) ;
		this.addChild( this._gameOverLayer , 10 ) ;
	} ,
	
	onLeave : function( )
	{
		cc.director.end( ) ;
	} ,
	
	onTryAgain : function( )
	{
		this._mainLayer.reset( ) ;
		this._mainLayer._generateNewBlock( ) ;
		this._mainLayer._generateNewBlock( ) ;
		this.removeChild( this._gameOverLayer ) ;
	} ,
	
	onExitTransitionDidStart : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
		if( this._gameOverLayer )
			this._gameOverLayer.release( ) ;
		this.removeAllChildren( ) ;
	}
} ) ;