<?php
    
    add_action( 'wp_enqueue_scripts', 'enqueue_form_scripts' );
    function enqueue_form_scripts()
    {
        
        if ( is_page('test-quote-form-page') ) {
            wp_enqueue_script('quote-scripts-js', '/wp-content/themes/storefront-child/quote-scripts.js', array( 'jquery' ), '1.0', true );
            
            $quote_nonce = wp_create_nonce( 'quote_nonce' );
            
            wp_localize_script(
                'quote-scripts-js',
                'my_sec_obj',
                array(
                    'admin_url' => admin_url( 'admin-post.php' ),
                    'nonce'    => $quote_nonce,
                )
            );
        } 
    }
        
    add_action( 'admin_post_nopriv_process_quote', 'prefix_process_quote');
    add_action( 'admin_post_process_quote', 'prefix_process_quote');

    function filterArray($key)
    {
        if ( str_contains($key, 'print-pos') )
        {
            return true;
        }
        
    }

    function generate_print_position_details()
    {
        
        $print_position_details = array();
        // /print_r($_POST);
        
        $printPosArray = array_filter($_POST, "filterArray", ARRAY_FILTER_USE_KEY);

        /* echo "<pre>";
        print_r ($testArray);
        echo "</pre>";  */
        $length = floor(count($printPosArray) / 2);

        $count = 0;
        
        $keys = array_keys($printPosArray);
        
        for ($i = 0; $i < $length; $i++)
        {
           /*  echo "<pre>";
            echo $printPosArray[$keys[$count]];
            echo "</pre>";  */

            /* echo "<pre>";
            echo $printPosArray[$keys[$count+1]];
            echo "</pre>";  */

            $print_position_id = $printPosArray[$keys[$count]];
            $print_positions = wc_get_product($print_position_id);
            $print_position_variations = $print_positions->get_available_variations();
            
            /* echo "<pre>";
            echo print_r($print_position_variations);
            echo "</pre>"; */ 

            for ($j = 0; $j < count($print_position_variations); $j++)
            {
                if ( $print_position_variations[$j]['attributes']['attribute_pa_number-of-colours'] ==  $printPosArray[$keys[$count+1]]) 
                {
                    /* echo "<pre>";
                    echo $print_position_variations[$j]['variation_id'];
                    echo "</pre>"; */
                    array_push($print_position_details, array( $print_position_id, 1, $print_position_variations[$j]['variation_id'], $printPosArray[$keys[$count+1]] ) );
                }
            }
            
            //var_dump( $cart->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation ) );
            

            if ($length > 1) 
            {
                $count += 2;
            }
            else 
            {
                break;
            }
            
        }  

    /*     echo "<pre>";
        echo print_r($print_position_details);
        echo "</pre>"; */

        /* $print_positions_chosen = $_POST['print_pos'];

        $print_position_details = array();

        $print_position_id = 123;

        $print_positions = wc_get_product($print_position_id);
        
        $print_position_variations = $print_positions->get_available_variations();        
       
        foreach ($print_position_variations as $print_position_variation)
        {   
           for ($i = 0; $i < count($print_positions_chosen); $i++) {
                if ( $print_position_variation['attributes']['attribute_pa_print-position'] ==  $print_positions_chosen[$i])
                {
                    array_push($print_position_details, array( $print_position_id, 1, $print_position_variation['variation_id'], $print_positions_chosen[$i]) );
                } 
            } 
        }      */  
        return $print_position_details; 
    }
    
    function generate_parent_product_details()
    {

        $parent_product_details = array();
        $parent_product_type_id = $_POST['product-type'];
        $parent_product_colour = $_POST['colour'];

        $parent_product = wc_get_product($parent_product_type_id);
        $colour_size_variations = $parent_product->get_available_variations();
        
       
        foreach ($colour_size_variations as $colour_size_variation)
        {

            if ( intval($_POST[$colour_size_variation['attributes']['attribute_pa_size']]) > 0 ) {
                
                array_push($parent_product_details, array( $parent_product_type_id, $parent_product_colour, $colour_size_variation['variation_id'], intval($_POST[$colour_size_variation['attributes']['attribute_pa_size']])) );
            } 

        }

        return $parent_product_details;
    }
    
    function intialise_cart()
    {   
        require WP_PLUGIN_DIR . '/woocommerce/includes/wc-cart-functions.php';
        require WP_PLUGIN_DIR . '/woocommerce/includes/wc-notice-functions.php';
        require WP_PLUGIN_DIR . '/woocommerce/includes/class-wc-cart.php';

        WC()->session = new WC_Session_Handler();
        WC()->session->init();

       if (!WC()->cart) {
            WC()->initialize_cart();
        } 
 
        $cart = WC();

        return $cart;
    }

    function add_parent_product_to_cart($cart, $parent_product_details)
    {

        for($i=0; $i < count($parent_product_details); $i++)
        {
            $cart->cart->add_to_cart( $parent_product_details[$i][0], $parent_product_details[$i][3], $parent_product_details[$i][2], array('attribute_pa_color' => $parent_product_details[$i][1]) );
        }

        //var_dump( $cart->cart->add_to_cart( 14, 23, 122, array('attribute_pa_color' => 'Blue') ) );
        
        //var_dump( $cart->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation ) );
        
        //wp_redirect("https://ici.ftmv.org/basket/");

    }

    function add_print_positions_to_cart($cart, $print_position_details)
    {   

        /* echo '<pre>';
        print_r($print_position_details);
        echo '</pre>';  */

        for($i=0; $i < count($print_position_details); $i++)
        {
            /* echo '<pre>';
            print_r($print_position_details[$i]);
            echo '</pre>'; */

            $cart->cart->add_to_cart( $print_position_details[$i][0], $print_position_details[$i][1], $print_position_details[$i][2], array('attribute_pa_print-position' => $print_position_details[$i][3]) );
        } 

        //var_dump( $cart->cart->add_to_cart( 14, 23, 122, array('attribute_pa_color' => 'Blue') ) );
        
        //var_dump( $cart->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation ) );
        
        //wp_redirect("https://ici.ftmv.org/basket/");

    }
    
    function prefix_process_quote()
    {   

        if(isset($_POST['quote_nonce'])) {
            if(wp_verify_nonce($_POST['quote_nonce'], 'quote_nonce')) {
     
                echo 'Nonce verified successfully'; 
                // process form here
                
                /* echo '<pre>'; 
                print_r($_POST);
                echo '</pre>'; */  
                $cart = intialise_cart();
                $print_position_details = generate_print_position_details();                
                $parent_product_details = generate_parent_product_details();

                add_print_positions_to_cart($cart, $print_position_details);
                add_parent_product_to_cart($cart, $parent_product_details); 

                /* $cart = intialise_cart();

                
                $parent_product_details = generate_parent_product_details();
                
                add_parent_product_to_cart($cart, $parent_product_details); 
                add_print_positions_to_cart($cart, $print_position_details);     */
                
               
                
                
                //wp_redirect("https://ici.ftmv.org/basket/");
     
            } else {
                echo 'nonce verification failed'; exit;
            }
        }
        

    }