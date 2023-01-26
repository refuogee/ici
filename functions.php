<?php
    
    add_action( 'wp_enqueue_scripts', 'enqueue_form_scripts' );
    function enqueue_form_scripts()
    {
        
        if ( is_page('test-quote-form-page') ) {
            wp_enqueue_script('quote-scripts-js', '/wp-content/themes/generatepress_child/quote-scripts.js', array( 'jquery' ), '1.0', true );
            
            $quote_nonce = wp_create_nonce( 'quote_nonce' );
            $garment_type_nonce = wp_create_nonce( 'garment_type_nonce' );
            
            
            wp_localize_script(
                'quote-scripts-js',
                'my_sec_obj',
                array(
                    'admin_url' => admin_url( 'admin-post.php' ),
                    'ajax_url'    => admin_url( 'admin-ajax.php' ),
                    'nonce'    => $quote_nonce,
                    'garment_type_nonce' => $garment_type_nonce
                )
            );
        } 
    }
        
    add_action( 'admin_post_nopriv_process_quote', 'prefix_process_quote');
    add_action( 'admin_post_process_quote', 'prefix_process_quote');

    add_filter( 'the_content', 'ftmv_content_filter', 99);
 
    function ftmv_content_filter( $content ) {
            if ( is_page('test-quote-form-page') ) {
                $the_form = file_get_contents(get_stylesheet_directory_uri() . '/the-form.php');
                //echo $asubHTML;
                return $the_form;
            } 
            else {
               return $content;			
            }
            
    }

    function filterArray($key)
    {
        // returns whether the input integer is odd
       /*  echo "<pre>";
        echo $key;
        echo "</pre>"; */
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

    function get_colours_per_print()
    {   
        $cpps = array();
        $colours_per_print_info = array();

        // Get colours per print by category type.
        $args = array(
            'category' => array( 'cpp' ),
        );

        $products = wc_get_products( $args );
        
        foreach ($products as $product) 
        {

            $cpps = [];
            $colours_per_print_info = [];

            $cpp_variations = $product->get_available_variations();            
            foreach ($cpp_variations as $cpp_variation) 
            {
                
                if ( !in_array($cpp_variation['attributes']['attribute_pa_number-of-colours'], $cpps ) ) 
                {
                    array_push($cpps, $cpp_variation['attributes']['attribute_pa_number-of-colours']);
                    array_push($colours_per_print_info, array("cpp" => $cpp_variation['attributes']['attribute_pa_number-of-colours'], "price" => $cpp_variation['display_regular_price']));
                }  
            }
        }   
        
        return $colours_per_print_info;
    }

    function get_extras()
    {   
        $extras = array();
        $extras_info = array();

        // Get colours per print by category type.
        $args = array(
            'category' => array( 'extras' ),
        );

        $products = wc_get_products( $args );
        
        // error_log(print_r($products, true));
        
        
        foreach ($products as $product) 
        {

            $extras = [];
            $extras_info = [];

            $extras_variations = $product->get_available_variations();            

            // error_log(print_r($extras_variations, true));
            
            foreach ($extras_variations as $extras_variation) 
            {
                // error_log(print_r($extras_variation, true));
                
                /* error_log($extras_variation['attributes']['attribute_pa_extras']);
                error_log($extras_variation['display_regular_price']); */
                

                if ( !in_array($extras_variation['attributes']['pa_extras'], $extras ) ) 
                {
                    array_push($extras, $extras_variation['attributes']['attribute_pa_extras']);
                    array_push($extras_info, array("extra" => $extras_variation['attributes']['attribute_pa_extras'], "price" => $extras_variation['display_regular_price']));
                } 
            } 
        }  
        
        
        return $extras_info;
    }



    function get_products_by_garment_type($garment_type) 
    {
        
        // Get garments of category type.
        $args = array(
            'category' => array( $garment_type ),
        );
        $products = wc_get_products( $args );

        $garment_colours = array();
        $chosen_garments = array();
        $colours = array();
        $colour_info = array();
        
        $sizes = array();
        $size_price_info = array();

        foreach ($products as $product) 
        {

            $garments_variations = $product->get_available_variations();
            
            $colours = [];
            $colour_info = [];

            $sizes = [];
            $size_price_info = [];

            foreach ($garments_variations as $garment_variations) 
            {
                // error_log(print_r($garment_variations, true));
              /*   error_log($garment_variations['attributes']['attribute_pa_color']);
                error_log($garment_variations['attributes']['attribute_pa_size']);
                error_log($garment_variations['display_regular_price']); */
                
                
                // error_log($garment_variations['attributes']['attribute_pa_size']);
                
                // in_array("100", $marks)

                if ( !in_array($garment_variations['attributes']['attribute_pa_color'], $colours ) ) 
                {
                    //error_log('this color '. $garment_variations['attributes']['attribute_pa_color'] .' is not in the array, add it');
                    array_push($colours, $garment_variations['attributes']['attribute_pa_color']);
                    
                    array_push($colour_info, array("colour" => $garment_variations['attributes']['attribute_pa_color'], "colour_url" => $garment_variations['image']['full_src']));

                    // array_push($size_price_info, array("size" => $garment_variations['attributes']['attribute_pa_size'], "price" => $garment_variations['display_regular_price']));

                }  

                if ( !in_array($garment_variations['attributes']['attribute_pa_size'], $sizes ) ) 
                {
                    array_push($sizes, $garment_variations['attributes']['attribute_pa_size']);
                    array_push($size_price_info, array("size" => $garment_variations['attributes']['attribute_pa_size'], "price" => $garment_variations['display_regular_price']));
                    //error_log('this color '. $garment_variations['attributes']['attribute_pa_color'] .' is not in the array, add it');
                    
                    
                    
                    
                    // error_log($garment_variations['attributes']['attribute_pa_size']);
                    // array_push($colour_info, array("colour" => $garment_variations['attributes']['attribute_pa_color'], "colour_url" => $garment_variations['image']['full_src']));

                }                  
            } 

            // error_log(print_r($size_price_info, true));

            $product_id = $product->get_id();
            $product_name = $product->get_name();
            $imageId = $product->get_image_id();
            $product_medium_img_url = wp_get_attachment_image_src( $imageId, 'medium' )[0];
            $product_large_img_url = wp_get_attachment_image_src( $imageId, 'large' )[0];

            $product_min_price = $product->get_variation_regular_price('min', true);
            $product_max_price = $product->get_variation_regular_price('max', true);

            
            array_push($chosen_garments, array("product_name" => $product_name, "product_id" => $product_id, "product_medium_img_url" => $product_medium_img_url, "product_large_img_url" => $product_large_img_url, "colour_info" => $colour_info, "min_price" => $product_min_price, "max_price" => $product_max_price, "size_price_info" => $size_price_info));
            // array_push($chosen_garments, array("product_id" => $product_id, "product_medium_img_url" => $product_medium_img_url, "product_large_img_url" => $product_large_img_url));
            
        } 

        /* error_log(print_r($colours, true));
        error_log(print_r($colour_url, true));
         */
        // error_log(print_r($colour_info, true));
        
        $colours_per_print_info = get_colours_per_print();
        $extras = get_extras();

        array_push($chosen_garments, $colours_per_print_info, $extras);

        return $chosen_garments;
        
        
    }

    add_action( 'wp_ajax_nopriv_get_garment_type', 'get_garments_of_type');
    add_action( 'wp_ajax_get_garment_type', 'get_garments_of_type');

    function get_garments_of_type()
    {
        /* error_log('the garments of type function was called');
        error_log(print_r( $_POST, true )); */

        if (wp_verify_nonce($_POST['garment_type_nonce'], 'garment_type_nonce')) {
            // echo 'Nonce verified successfully'; 
            $garment_type = $_POST['garment_choice'];
            $chosen_garments = get_products_by_garment_type($garment_type);            
            echo json_encode($chosen_garments);            
            wp_die();

        } else {
            // echo 'nonce verification failed'; 
            exit;
        }
    }


   


