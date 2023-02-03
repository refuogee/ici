<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://www.toptal.com/resume/ratko-solaja
 * @since      1.0.0
 *
 * @package    Toptal_Save
 * @subpackage Toptal_Save/admin/partials
 */


?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<!-- <section class="section-container intro-container">
    <div>
        <p class="section-title">
            Introduction
        </p>
        <p>
            Welcome to Inner City Ink Quotation Process <br><br>
            After you fill out this order request, we will contact you to go over details and availability before the order is completed.
        </p>
    </div>
</section> -->

<section class="section-container garment-use-container">
    <div class="choice-container user-choice border-hover">
        <div class="choice-text-container">            
            <p class="choice-option-text">
                Promo
            </p>            
            <p class="choice-description">
                Choose this if your garments will be used as promotional items.
            </p>            
        </div>
    </div>
    <div class="choice-container user-choice border-hover">
        <div class="choice-text-container">
            <p class="choice-option-text">
                Resale
            </p>            
            <p class="choice-description">
                Choose this if your garments are going to be sold.
            </p>            
        </div>
    </div>
</section>

<section class="section-container client-details-container">
    <div class="client-details-form-container">
        <form class="client-details-form">
            <p class="input-section">
                <!-- <label for="name">Name: </label> -->
                <input type="text" id="name" name="user_name" placeholder="Name">                    
            </p>
            <p class="input-section">
                <!-- <label for="surname">Surname: </label>      -->
                <input type="text" id="Surname" name="user_surname" placeholder="Last Name">                
            </p>
            <p class="input-section">
                <!-- <label for="mobile">Mobile Number:</label>  -->
                <input type="tel" id="mobile" name="user_mobile" placeholder="Mobile Number">
            </p>
            <p class="input-section">
                <!-- <label for="email">Email Address:</label>  -->
                <input type="email" id="email" name="user_email" placeholder="Email Address">
            </p>             
            <div class="front-pos-button-container">
                <button type="button" class="signup-btn next">Next</button>
            </div>   
        </form> 
    </div>
</section>

<section class="section-container product-type-choice-container">
    <div class="heading-container extras-heading">
        <p class="heading-text">
            Garments
        </p>
    </div>
    <!-- <div class="product-types-container">
    </div> -->
    <div class="product-types-container">
        
       
    <div class="slider-container">
        <div class="nav-pane left-nav-pane">
            <div class="nav-button-container">                            
                <i class="arrow left-nav"></i>
            </div>
        </div>

        <div class="slide-container">
        </div>

        <div class="nav-pane right-nav-pane">
            <div class="nav-button-container">
                <i class="arrow right-nav"></i>
            </div>
        </div>
    </div>
        
        
      

    </div>
    <!-- ---------------------------------------------------- -->

    



    <!-- ---------------------------------------------------- -->
    <div class="nav-btn-container">        
        <button type="button" class="nav-btn next">Next</button>
    </div>
</section>

<section class="section-container product-colour-choice-container">
    <div class="heading-container extras-heading">
        <p class="heading-text">
            Color
        </p>
    </div>
    <div class="product-chosen-container colour-choice">        
        <div class="chosen-product-container">
            <div class="chosen-product-img-container colour-choice-wrap">
                <img class="colour-choice-img">
            </div>
        </div>
        <div class="colour-choice-container">
            <div class="colour-picker">                
            </div>
        </div>
               
    </div>
    <div class="nav-btn-container">
        <button type="button" class="nav-btn previous">Back</button>
        <button type="button" class="nav-btn next">Next</button>
    </div>
</section>

<section class="section-container product-choice-container print-position-section">
    <div class="heading-container extras-heading">
        <p class="heading-text">
            Position of the Print
        </p>
    </div>
    <div class="product-chosen-container printpos-choice">        
        <div class="chosen-product-container">
            <div class="print-position-img-container chosen-product-img-container position-choice-wrap">
                <img class="print-position-img">
                <img class="print-position-img-layer">
            </div>
        </div>
        <div class="print-position-container">
            <div class="print-positions-choice-container">
                <div class="print-position border-hover" data-position="fc">
                    <div class="print-position-text-container">
                        <p>
                            Front Centre
                        </p>
                    </div>    
                </div>
                <div class="print-position border-hover" data-position="lp">
                    <div class="print-position-text-container">
                        <p>
                            Left Pocket
                        </p>
                    </div>    
                </div>
                <div class="print-position border-hover" data-position="rp">
                    <div class="print-position-text-container">
                        <p>
                            Right Pocket
                        </p>
                    </div>    
                </div>
                <div class="print-position border-hover" data-position="bl">
                    <div class="print-position-text-container">
                        <p>
                            Bottom Left
                        </p>
                    </div>    
                </div>
                <div class="print-position border-hover" data-position="br">
                    <div class="print-position-text-container">
                        <p>
                            Bottom Right
                        </p>
                    </div>    
                </div>
                <div class="print-position border-hover" data-position="ic">
                    <div class="print-position-text-container">
                        <p>
                            Inner Neck
                        </p>
                    </div>    
                </div>
                
            </div>
        </div>
               
    </div>
    <div class="nav-btn-container">
        <button type="button" class="nav-btn previous">Back</button>
        <button type="button" class="nav-btn next">Next</button>
    </div>
</section>

<section class="section-container product-choice-container colour-amount-section">
    <div class="heading-container extras-heading">
        <p class="heading-text">
            Colors Per Print
        </p>
    </div>
    <div class="product-chosen-container cpp-choice">        
        <div class="chosen-product-container">
            <div class="colour-amount-img-container chosen-product-img-container colours-choice-wrap">
                <img class="colour-amount-img">
                <img class="colour-amount-img-layer" src="https://ici.ftmv.org/wp-content/uploads/2022/04/one-color.png">
            </div>
        </div>
        <div class="colour-amount-choice-container">
            <div class="colour-amount-picker">
                <div class="colour-amount-block border-hover" data-colamnt="one">
                    <p class="colour-amount-text"> 
                        I
                    </p>
                </div>
                <div class="colour-amount-block border-hover" data-colamnt="two">
                    <p class="colour-amount-text"> 
                        II
                    </p>
                </div>
                <div class="colour-amount-block border-hover" data-colamnt="three">
                    <p class="colour-amount-text"> 
                        III
                    </p>
                </div>                
                <div class="colour-amount-block border-hover" data-colamnt="four">
                    <p class="colour-amount-text"> 
                        IV
                    </p>
                </div>
            </div>
        </div>
        
               
    </div>
    <div class="nav-btn-container">
        <button type="button" class="nav-btn previous">Back</button>
        <button type="button" class="nav-btn next">Next</button>
    </div>
</section>

<section class="section-container product-choice-container item-amount-section">
    <div class="heading-container extras-heading">
        <p class="heading-text">
            Sizes
        </p>
    </div>
    <div class="product-chosen-container size-choice">        
        <div class="item-amount-choice-container">
            <div class="item-amount-container">
                <div class="col-fifty">
                    <div class="item-amount-choice-label-container">
                        <div class="item-amount-label-container">
                            <p class="item-amount-label-text">
                                XS
                            </p>
                        </div>    
                        <div class="item-amount-input-container">
                            <input class="item-amount-input" type="number" name="xs" data-price min="0" role="presentation" autocomplete="false">
                        </div>
                    </div>
                    <div class="item-amount-choice-label-container">
                        <div class="item-amount-label-container">
                            <p class="item-amount-label-text">
                                S
                            </p>
                        </div>    
                        <div class="item-amount-input-container">
                            <input class="item-amount-input" type="number" name="s" data-price min="0" role="presentation" autocomplete="false">
                        </div>
                    </div>
                    <div class="item-amount-choice-label-container">
                        <div class="item-amount-label-container">
                            <p class="item-amount-label-text">
                                M
                            </p>
                        </div>    
                        <div class="item-amount-input-container">
                            <input class="item-amount-input" type="number" name="m" data-price min="0" role="presentation" autocomplete="false">
                        </div>
                    </div>
                </div>

                <div class="col-fifty">
                    <div class="item-amount-choice-label-container">
                        <div class="item-amount-label-container">
                            <p class="item-amount-label-text">
                                L
                            </p>
                        </div>    
                        <div class="item-amount-input-container">
                            <input class="item-amount-input" type="number" name="l" data-price min="0" role="presentation" autocomplete="false">
                        </div>
                    </div>
                    <div class="item-amount-choice-label-container">
                        <div class="item-amount-label-container">
                            <p class="item-amount-label-text">
                                XL
                            </p>
                        </div>    
                        <div class="item-amount-input-container">
                            <input class="item-amount-input" type="number" name="xl" data-price min="0" role="presentation" autocomplete="false">
                        </div>
                    </div>
                    <div class="item-amount-choice-label-container">
                        <div class="item-amount-label-container">
                            <p class="item-amount-label-text">
                                XXL
                            </p>
                        </div>    
                        <div class="item-amount-input-container">
                            <input class="item-amount-input" type="number" name="xxl" data-price min="0" role="presentation" autocomplete="false">
                        </div>
                    </div>
                </div>
            </div>            
        </div>
               
    </div>
    <div class="nav-btn-container">
        <button type="button" class="nav-btn previous">Back</button>
        <button type="button" class="nav-btn next">Next</button>
    </div>
</section>

<section class="section-container product-choice-container extras-section">
    <div class="heading-container extras-heading">
        <p class="heading-text">
            Extras
        </p>
    </div>
    <div class="product-chosen-container extra-choice">
        <div class="chosen-product-container">
            <div class="extras-img-container chosen-product-img-container">
                <img class="extras-img" src="https://ici.ftmv.org/wp-content/uploads/2022/08/extras-none.jpg">                
            </div>
        </div>
        <div class="extras-container">
            <div class="extras-choice-container">
                <div class="extras border-hover" data-modifier="bag">
                    <div class="extras-tick-container">
                        <div class="tick"></div>
                    </div>    
                    <div class="extras-text-container">
                        <p class="extras-text">
                            Bag Your Items
                        </p>
                    </div>    
                </div>
                <div class="extras border-hover" data-modifier="tag">
                    <div class="extras-tick-container">
                        <div class="tick"></div>
                    </div>    
                    <div class="extras-text-container">
                        <p class="extras-text">
                            Tag Your Items
                        </p>
                    </div>    
                </div>
                
                <div class="extras border-hover" data-modifier="none">
                    <div class="extras-tick-container">
                        <div class="tick"></div>
                    </div>    
                    <div class="extras-text-container">
                        <p class="extras-text">
                            No Extras
                        </p>
                    </div>    
                </div>
            </div>
        </div>
               
    </div>
    <div class="nav-btn-container">
        <button type="button" class="nav-btn previous">Back</button>
        <button type="button" class="nav-btn next">Next</button>
    </div>
</section>

<section class="section-container product-choice-container order-overview-section">
    <div class="product-chosen-container">     

        <div class="heading-container">
            <p class="heading-text">
                Your Order
            </p>
        </div>

        <div class="order-overview-container">

            <div class="overview-column amounts">

                <div class="overview-header-container">
                    <div class="title-container">
                        <p class="subheading-text">
                            Sizes
                        </p>
                    </div>                
                </div>

                <div class="overview-size-container">
                    <div class="overview-size-info-container">
                    </div>

                    <!-- <div class="title-container">
                        <p class="subheading-text amount">
                            12 XL
                        </p>
                    </div>                
                    <div class="title-container">
                        <p class="subheading-text amount">
                            22 M
                        </p>
                    </div>                 -->
                </div>

            </div>
            
            <div class="overview-column main-product">
                <div class="title-container">
                    <p class="subheading-text main-garment-title">                        
                    </p>
                </div>                

                <div class="overview-product-image-container overview-colour-wrap">
                    <img class="overview-product-img">
                    <img class="overview-product-img-layer">
                </div>
            </div>

            <div class="overview-column other-options">
                <div class="overview-row top">
                    <div class="print-pos-colour-amnt-container">
                        

                        <div class="colour-amount-container">
                            <div class="title-container">
                                <p class="subheading-text">
                                    Colors Per Print
                                </p>
                            </div>                
                            <div class="overview-product-colour-amount-image-container cpp-colour-wrap">
                                <img class="overview-product-colour-amount-img">
                                <img class="overview-product-colour-amount-img-layer">
                            </div>                    
                        </div>  
                    </div>

                    <div class="extras-overview-container">
                        <div class="title-container">
                            <p class="subheading-text">
                                Extras
                            </p>
                        </div>
                        <div class="overview-product-extras-image-container">                            
                        </div>
                    </div>  
                    
                </div>  
                
                <div class="overview-row bottom">
                    <div class="totals-container">
                        

                        <div class="total-header-container">
                            <div class="total-title-container">
                                <p class="subheading-text">
                                    Totals
                                </p>
                            </div>
                        </div>  

                        <div class="total-columns-header-container">
                            <p class="total-heading-text heading-item">
                                Item
                            </p>
                            <p class="total-heading-text heading-quantity">
                                Quantity
                            </p>
                            <p class="total-heading-text heading-ppu">
                                PPU
                            </p>
                            <p class="total-heading-text heading-amount">
                                Amount
                            </p>
                        </div>
                    </div>
                </div>
            </div>            
    </div>
    <div class="nav-btn-container final">        
        <button type="button" class="nav-btn complete-sale">Order and Pay!</button>
    </div>
</section>

		