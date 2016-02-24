"use strict" ;

var comp = gxd.comp || { } ;

comp.GameOverLayer = cc.LayerColor.extend(
{
	_messageLabel	: null ,
	_menu			: null ,
	
	ctor : function( color , width , height )
	{
		this._super( color , width , height ) ;
		this._initMessageLabel( ) ;
		this._initMenu( ) ;
	} ,
	
	_initMessageLabel : function( )
	{
		this._messageLabel = new cc.LabelTTF( ) ;
		this._messageLabel.setFontName( "Arial" ) ;
		this._messageLabel.setFontSize( 100 ) ;
		this._messageLabel.setPosition( this.getContentSize( ).width * 0.5 ,
										this.getContentSize( ).height * 0.5 ) ;
		
		this.addChild( this._messageLabel ) ;
	} ,
	
	_initMenu : function( )
	{
		var leaveButton		= new cc.MenuItemSprite( new cc.Sprite( res.leave_normal ) ,
													 new cc.Sprite( res.leave_selected ) ,
													 this._onLeaveCallback ,
													 this ) ;
		
		var tryAgainButton	= new cc.MenuItemSprite( new cc.Sprite( res.try_again_normal ) ,
													 new cc.Sprite( res.try_again_selected ) ,
													 this._onTryAgainCallback ,
													 this ) ;
		
		this._menu			= new cc.Menu( leaveButton , tryAgainButton ) ;
		
		this._menu.alignItemsHorizontallyWithPadding( 50 ) ;
		this._menu.setPosition( this.getContentSize( ).width * 0.5 ,
								this.getContentSize( ).height * 0.3 ) ;
		
		this.addChild( this._menu ) ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	setGameCompleteState : function( state )
	{
		var message = state ? comp.GameOverLayer.completeMessage : comp.GameOverLayer.FailedMessage ;
		
		this._setGameOverMessage( message ) ;
	} ,
	
	_setGameOverMessage : function( message )
	{
		this._messageLabel.setString( message ) ;
	} ,
	
	_onLeaveCallback : function( )
	{
		cc.log( "onLeaveCallback" ) ;
		this.getParent( ).onLeave( ) ;
	} ,
	
	_onTryAgainCallback : function( )
	{
		cc.log( "onTryAgainCallback" ) ;
		this.getParent( ).onTryAgain( ) ;
	} ,
	
	onExitTransitionDidStart : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
	}
} ) ;

Object.defineProperty( comp.GameOverLayer , "completeMessage" ,
{
	value		: "You Win!" ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.GameOverLayer , "FailedMessage" ,
{
	value		: "Game Over" ,
	enumerable	: true
} ) ;