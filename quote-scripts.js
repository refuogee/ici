(function() {
    console.log("quote-js loaded");    
    
    window.addEventListener('load', function () {        
        setTimeout(() => {
            goToPage(0);
          }, 1000)
      })

    let saleCompleteBtn = document.querySelector('.complete-sale');
    saleCompleteBtn.addEventListener('click', () => {
        window.location.reload(true);        
    })

    class OrderObject {
        constructor() {
            this.setup = { 'description': 'setup costs', 'total': 500, 'quantity': 1, 'ppu': 500};
            this.extras = { 'extras': '', 'total': 0, 'quantity': 0, 'ppu': 0};

            this.garmentTotal = function () {
                let total = 0;
                if (this.sizes.length > 0) 
                {
                    this.sizes.forEach(size => {
                        if (size.amount !== '') 
                        {
                            total += parseInt(size.total);
                        }
                    });
                }
                return total;    
            }

            
            this.garmentAmount = function () {
                let totalAmount = 0;
                if (this.sizes.length > 0) 
                {
                    this.sizes.forEach(size => {
                        if (size.amount !== '') 
                            {
                                totalAmount += parseInt(size.amount);
                            }
                    });
                }
                return totalAmount;
            };
            

            this.getTotal = function () {
                /* let total = 0;
                console.log(this);
                console.log(this.colours_per_print.total);
                console.log(this.garmentTotal());
                console.log(this.setup.total);
                console.log(this.extras.total); */
                let cppTotal = this.colours_per_print.total || 0;
                let garmentTotal = this.garmentTotal() || 0;
                let setupTotal = this.setup.total || 0;
                let extrasTotal = this.extras.total || 0;
                return  cppTotal + garmentTotal + setupTotal + extrasTotal;
            };
                
        }
    }

    let wooCommerceData;
    let cppData;
    let extrasData;
    let orderObj = new OrderObject();
    
    // The sections are created as variables so users can easily be moved from one to the next

    let garmentChoice = document.querySelector('.garment-use-container');
    // let clientDetails = document.querySelector('.client-details-container');
    let productType = document.querySelector('.product-type-choice-container');
    let colourPicker = document.querySelector('.product-colour-choice-container');
    let printPositionPicker = document.querySelector('.print-position-section');
    let colourAmountPicker = document.querySelector('.colour-amount-section');
    let extrasPicker = document.querySelector('.extras-section');
    let amountPicker = document.querySelector('.item-amount-section');
    let orderOverview = document.querySelector('.order-overview-section');
    
    let currentIndex = 0;
    
    let contents = [garmentChoice, /* clientDetails,*/ productType, colourPicker, printPositionPicker, colourAmountPicker, amountPicker, extrasPicker, orderOverview];
    let sectionMax = contents.length;
    let sectionMin = 0;
    

    /*
        Display Garment Choices takes resale or promo category data from woocommerce and inserts as many garments 
        as returned.

        Currently no pagination in data or scrolling solution implemented. 
    */

    let fc = 'https://ici.ftmv.org/wp-content/uploads/2022/07/front-center.png';
    let lp = 'https://ici.ftmv.org/wp-content/uploads/2022/07/front-left-pocket.png';
    let rp = 'https://ici.ftmv.org/wp-content/uploads/2022/07/front-right-pocket.png';
    let bl = 'https://ici.ftmv.org/wp-content/uploads/2022/07/front-bottom-left.png';
    let br = 'https://ici.ftmv.org/wp-content/uploads/2022/07/front-bottom-right.png';
    let ic = 'https://ici.ftmv.org/wp-content/uploads/2022/07/inner-neck.png';

    let printPositionUrls = {
                                fc : 'https://ici.ftmv.org/wp-content/uploads/2022/12/front-center.png',
                                lp : 'https://ici.ftmv.org/wp-content/uploads/2022/12/front-left-pocket.png',
                                rp : 'https://ici.ftmv.org/wp-content/uploads/2022/12/front-right-pocket.png',
                                bl : 'https://ici.ftmv.org/wp-content/uploads/2022/12/front-bottom-left.png',
                                br : 'https://ici.ftmv.org/wp-content/uploads/2022/12/front-bottom-right.png',
                                ic : 'https://ici.ftmv.org/wp-content/uploads/2022/12/inner-neck.png'
                            };
    
    let printColourAmountImages = {
                                    one : 'https://ici.ftmv.org/wp-content/uploads/2022/04/one-color.png',
                                    two : 'https://ici.ftmv.org/wp-content/uploads/2022/04/two-color.png',
                                    three : 'https://ici.ftmv.org/wp-content/uploads/2022/04/three-color.png',
                                    four : 'https://ici.ftmv.org/wp-content/uploads/2022/04/four-color.png',
                                }
                            
    let extrasImages = {
        tag : 'https://ici.ftmv.org/wp-content/uploads/2022/08/extras-tag.jpg',
        bag : 'https://ici.ftmv.org/wp-content/uploads/2022/08/extras-bag.jpg',
        none : 'https://ici.ftmv.org/wp-content/uploads/2022/08/extras-none.jpg'
    }

    // This next functions handles the setting up of the totals in the overview section - as each section gets interacted with totals are updated.

    // Creates the html row with data that ends up in the overview section's total section
    function getTotalItemHTML(totalItemObject)
    {
        description = totalItemObject.description;
        quantity = totalItemObject.quantity;
        ppu = totalItemObject.ppu;
        itemTotal = totalItemObject.itemTotal;
        rowClass = totalItemObject.rowClass;

        return `<div class="total-columns-container ${rowClass}"><p class="total-content-text content-item">${description}</p><p class="total-content-text content-quantity">${quantity}</p><p class="total-content-text content-ppu">${ppu}</p><p class="total-content-text content-amount">${itemTotal}</p></div>`;
    }

    // using Intl.Numberformat left a space between currency sign and amount - this function removes the space - also makes using it more readable
    function returnFormattedCurrency(value)
    {   
        let tempNumber = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
        let formattedString = tempNumber.slice(0,1) + tempNumber.slice(2, tempNumber.length);        
        return formattedString;
    }

    // This function for the overview totals - checks if any children exists in case user's change their choice at the various
    function removeChildrenFromContainer(container, childClassName)
    {        
        let children = container.querySelectorAll(`.${childClassName}`);
        children.forEach(child => {
            child.remove();
        })

    }

    // Used in conjunction with removechildren - checks if child of a certain class is in the container of provided class
    function checkChildInContainer(container, childClassName)
    {
        
        if (container.querySelector(`.${childClassName}`))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // This function is used with the function updateOverviewTotals to generate the various totals for the overview total section
    function getTotalRowData(section)
    {        
        let totalItemObject = new Object();
        let overviewTotalsContentRow;
        
        switch (section)
        {
            case section = "setup":                                
                totalItemObject.description = orderObj.setup.description;
                totalItemObject.quantity = orderObj.setup.quantity;
                totalItemObject.ppu = returnFormattedCurrency(orderObj.setup.ppu);                
                totalItemObject.itemTotal = returnFormattedCurrency(orderObj.setup.total);
                totalItemObject.rowClass = 'setup-total';
                overviewTotalsContentRow = getTotalItemHTML(totalItemObject);

                return overviewTotalsContentRow;

            case section = "colours_per_print":              
                cppData.forEach(cpp => {
                    if (cpp.cpp == orderObj.colours_per_print["cpp"])
                    {
                        totalItemObject.description = cpp.cpp + ' Color per print';
                        totalItemObject.quantity = orderObj.garmentAmount();
                        totalItemObject.ppu = returnFormattedCurrency(cpp.price);
                        totalItemObject.itemTotal = returnFormattedCurrency(cpp.price * orderObj.garmentAmount());
                        totalItemObject.rowClass = 'cpp-total';
                        overviewTotalsContentRow = getTotalItemHTML(totalItemObject);  
                        orderObj.colours_per_print = {"cpp" : cpp.cpp, "total" : cpp.price * orderObj.garmentAmount()}                      
                    }
                })                
                return overviewTotalsContentRow;    
                
            case section = "extras":   
                let theExtra = arguments[1];
                
                extrasData.forEach(extra => {
                    if (extra.extra == theExtra)
                    {
                        totalItemObject.description = `Extras - ${extra.extra}`;
                        totalItemObject.quantity = orderObj.garmentAmount();
                        totalItemObject.ppu = returnFormattedCurrency(extra.price);
                        totalItemObject.itemTotal = returnFormattedCurrency(extra.price * orderObj.garmentAmount());
                        totalItemObject.rowClass = `extras-total ${extra.extra}`;                        
                        overviewTotalsContentRow = getTotalItemHTML(totalItemObject);                        
                    }                    
                })                
                return overviewTotalsContentRow; 

            case section = "id":                                
                let theData = getWooCommerceData();
                let theProduct = theData.filter(theData => theData.product_id == orderObj['id']);

                totalItemObject.description = 'garments';
                totalItemObject.quantity = orderObj.garmentAmount();
                totalItemObject.ppu = `${returnFormattedCurrency(theProduct[0].min_price)} - ${returnFormattedCurrency(theProduct[0].max_price)}`;

                totalItemObject.itemTotal = returnFormattedCurrency(orderObj.garmentTotal());
                console.log('cgecjubg');
                console.log(orderObj.garmentTotal());
                totalItemObject.rowClass = 'garment-total';

                overviewTotalsContentRow = getTotalItemHTML(totalItemObject);
                return overviewTotalsContentRow;    
            case section = "total":
                totalItemObject.description = '';
                totalItemObject.quantity = '';
                totalItemObject.ppu = 'Total';
                totalItemObject.itemTotal = returnFormattedCurrency(orderObj.getTotal());
                totalItemObject.rowClass = 'overview-total';
                overviewTotalsContentRow = getTotalItemHTML(totalItemObject);
                return overviewTotalsContentRow; 

                
        }
    }

    // This function serves as a controller which handles each overview total's  
    function updateOverviewTotals(section)
    {
        let overviewTotalsContainer = document.querySelector('.totals-container');
        let overviewTotalsContentRow;        
        let div = document.createElement('div');
        let totalRowClassName;

        switch (section)
        {
            case section = "setup":                
                overviewTotalsContentRow = getTotalRowData(section);
                overviewTotalsContainer.insertAdjacentHTML('beforeend', overviewTotalsContentRow);
                break;

            case section = "colours_per_print":                
                overviewTotalsContentRow = getTotalRowData(section);                
        
                div.innerHTML = overviewTotalsContentRow;                
                totalRowClassName = div.querySelector('.total-columns-container').classList[1];        

                if (checkChildInContainer(overviewTotalsContainer, totalRowClassName))
                {                 
                    removeChildrenFromContainer(overviewTotalsContainer, totalRowClassName);
                }

                overviewTotalsContainer.insertAdjacentHTML('beforeend', overviewTotalsContentRow);
                break;

            case section = "extras":         
            
                if (checkChildInContainer(overviewTotalsContainer, 'extras-total'))
                {                 
                    removeChildrenFromContainer(overviewTotalsContainer, 'extras-total');
                }
                
                if (orderObj.extras.extras.length > 0 && orderObj.extras.extras[0] !== 'none')
                {
                    let extras = orderObj.extras.extras;
                    let extrasTotal = 0;
                    extras.forEach(extra => {                    
                        
                        extrasData.forEach(extraData => {
                            
                            if (extraData.extra == extra)
                            {
                                extrasTotal += extraData.price * orderObj.garmentAmount();
                            }
                        });

                        overviewTotalsContentRow = getTotalRowData(section, extra);
                        div.innerHTML = overviewTotalsContentRow;  

                        overviewTotalsContainer.insertAdjacentHTML('beforeend', overviewTotalsContentRow);
                                                
                    })        
                    orderObj.extras.total = extrasTotal;
                } 
                else 
                {
                    orderObj.extras.total = 0;
                }
                
                break;

            case section = "garment":                
                overviewTotalsContentRow = getTotalRowData('id');
                div.innerHTML = overviewTotalsContentRow;                
                totalRowClassName = div.querySelector('.total-columns-container').classList[1];                
                if (checkChildInContainer(overviewTotalsContainer, totalRowClassName))
                {                 
                    removeChildrenFromContainer(overviewTotalsContainer, totalRowClassName);
                }
                overviewTotalsContainer.insertAdjacentHTML('beforeend', overviewTotalsContentRow);
                break;
            
            case section = "total":  
                overviewTotalsContentRow = getTotalRowData('total');
                
                if (checkChildInContainer(overviewTotalsContainer, 'overview-total'))
                {                 
                    removeChildrenFromContainer(overviewTotalsContainer, 'overview-total');
                }                 
                overviewTotalsContainer.insertAdjacentHTML('beforeend', overviewTotalsContentRow);
                break;
        }
    }
    
    // These next functions set the overview up as each section is interacted with

    function overviewGarmentSetup(productId)
    {
        let theData = getWooCommerceData();
        let theProduct = theData.filter(theData => theData.product_id == productId);                
        let overviewMainImg = document.querySelector('.overview-product-img');
        let overviewMainTitle = document.querySelector('.main-garment-title');        
        let overviewColourAmntImg = document.querySelector('.overview-product-colour-amount-img');
        
        
        overviewMainImg.src = theProduct[0].product_large_img_url;
        overviewColourAmntImg.src = theProduct[0].product_large_img_url;
        overviewMainTitle.innerText = theProduct[0].product_name;
    }

    function overviewGarmentColourSetup(productColourCode)
    {        
        let combined = '#' + productColourCode;                
        let overviewMainColourWrap = document.querySelector('.overview-colour-wrap');        
        let overviewCppColourWrap = document.querySelector('.cpp-colour-wrap');        
        
        overviewMainColourWrap.style.backgroundColor = combined;
        overviewCppColourWrap.style.backgroundColor = combined;
    }

    function overviewGarmentPrintPosSetup(printPosition)
    {        
        let overviewPrintPositionImage = document.querySelector('.overview-product-img-layer');
        overviewPrintPositionImage.src = printPositionUrls[printPosition];
    }

    function overviewGarmentCPPSetup(printColourAmount)
    {       
        let overviewColourAmountImage = document.querySelector('.overview-product-colour-amount-img-layer');
        overviewColourAmountImage.src = printColourAmountImages[printColourAmount];
    }

    function overviewGarmentExtras()
    {   
        let extras = orderObj.extras.extras;
        
        let extrasImageContainer = document.querySelector('.overview-product-extras-image-container');
        let extrasOverviewImages = extrasImageContainer.querySelectorAll('.overview-product-extras-img');

        if (extrasOverviewImages.length != 0)
        {            
            extrasImageContainer.replaceChildren();
        }

        for (let i = 0; i < extras.length; i++)
        {
            let newImg = document.createElement("img");

            if (extras[i] === 'none')
            {                
                newImg.setAttribute("class", "overview-product-extras-img extras-none");                
                newImg.src = extrasImages[extras[i]];
                extrasImageContainer.insertAdjacentElement('beforeend', newImg); 
            }
            else
            {
                newImg.setAttribute("class", "overview-product-extras-img");
                newImg.src = extrasImages[extras[i]];
                extrasImageContainer.insertAdjacentElement('beforeend', newImg); 
            }
        }
    }

    function overviewSizes()
    {
        let sizes = orderObj.sizes;

        let overviewSizesContainer = document.querySelector('.overview-size-container');
        
        if (overviewSizesContainer.length != 0)
        {            
            overviewSizesContainer.replaceChildren();
        }

        for (let i = 0; i < sizes.length; i++)
        {
            if (sizes[i].amount !== '')
            {
                let newSizeInfo = document.createElement("div");
                newSizeInfo.setAttribute("class", "overview-size-info-container");
                newSizeInfo.innerHTML = `<p class="sizes-amount-text">${sizes[i].amount}</p><p class="amount-value-text">${sizes[i].fullName}</p>`;
                overviewSizesContainer.insertAdjacentElement('beforeend', newSizeInfo); 
            }
        }
    }

    // Handles Size Amounts Interaction

    let sizeInputs = document.querySelectorAll('.item-amount-input');
    sizeInputs.forEach(sizeInput => {
        sizeInput.addEventListener('change', () => {
            handleSizes(sizeInputs);

            updateOverviewTotals('garment');
            updateOverviewTotals('colours_per_print');    
            updateOverviewTotals('total');                        
        });
    })

    let sizeArray = new Array();
    
    function handleSizes(sizeInputs)
    {        
        sizeArray = [];
        let total = 0;
        let sizeTotal = 0;
        let fullName = '';
        let size = '';

        sizeInputs.forEach(sizeInput => {
            if (sizeInput.value > 0)
            {
                sizeTotal = sizeInput.value * sizeInput.getAttribute('data-price');
                size = sizeInput.getAttribute('name');

                switch (size)
                {
                    case size = "xs": 
                        fullName = "extra small";
                    break;
                    case size = "s": 
                        fullName = "small";
                    break;
                    case size = "m": 
                        fullName = "medium";
                    break;
                    case size = "l":                         
                        fullName = "large";                        
                    break;
                    case size = "xl": 
                        fullName = "extra large";
                    break;
                    case size = "xxl": 
                        fullName = "extra extra large";
                    break;
                }
                sizeArray.push({'size' : sizeInput.getAttribute('name'), 'fullName' : fullName, 'amount' : sizeInput.value, 'total' : sizeTotal });
            }
            
        })
        
        orderObj.sizes = sizeArray;  
        overviewSizes();
    }

    // Handles Extras Click functionality

    function handleExtrasClick()
    {
        
        let clickContainer = this.querySelector('.extras-tick-container');

        if (this.getAttribute('data-modifier') == 'none')
        {
            let parentElement = this.parentElement;
            let children = parentElement.querySelectorAll('.extras');  

            children.forEach(child => {
                child.removeEventListener('mouseover', handleExtrasMouseOver);  
                if (child.classList.contains('selected-border'))
                {
                    child.classList.remove('selected-border')                    
                    
                }
                if (child.querySelector('.extras-tick-container').classList.contains('display-tick'))
                {
                    child.querySelector('.extras-tick-container').classList.remove('display-tick');
                    
                }
                
            })
            
            
        }

        if (this.getAttribute('data-modifier') != 'none')
        {
            let parentElement = this.parentElement;
            let children = parentElement.querySelectorAll('.extras');  

            children.forEach(child => {
                // child.classList.remove('border-hover');   
                // child.removeEventListener('mouseover', handlePrintColourAmountMouseOver);  
                child.removeEventListener('mouseover', handleExtrasMouseOver);  
                if (child.classList.contains('selected-border') && child.getAttribute('data-modifier') == 'none')
                {
                    child.classList.remove('selected-border')
                    

                    if (child.querySelector('.extras-tick-container').classList.contains('display-tick'))
                    {
                        child.querySelector('.extras-tick-container').classList.remove('display-tick');
                        
                    }
                }
            })
            
        } 
        
        clickContainer.classList.toggle('display-tick');
        this.classList.toggle('selected-border');
        let extrasChoice = this.getAttribute('data-modifier');
        let extrasImage = document.querySelector('.extras-img');
        extrasImage.src = extrasImages[extrasChoice];

        let parentElement = this.parentElement;
        let children = parentElement.querySelectorAll('.extras');          
        let extrasArray = new Array();
        
        let extrasCount = 0;
        children.forEach(child => {            
            if (child.classList.contains('selected-border') )
            {
                extrasCount++;
                extrasArray.push(child.getAttribute('data-modifier'));
            }            
        })        
        if (extrasCount == children.length)
        {
            extrasArray.push('none');
        }

        orderObj.extras = {"extras" : extrasArray};         

        overviewGarmentExtras();   
        console.log('where the things get called');
        console.log(orderObj);
        updateOverviewTotals('extras'); 
        updateOverviewTotals('total');                
    }
    
    // Handles Extras Section Mouseover

    function handleExtrasMouseOver()
    {
        let extrasChoice = this.getAttribute('data-modifier');
        let extrasImage = document.querySelector('.extras-img');
        extrasImage.src = extrasImages[extrasChoice];
    }

    // Adds the event listener functionality to the section

    let extrasChoices = document.querySelectorAll('.extras');
    extrasChoices.forEach(extrasChoice => {
        extrasChoice.addEventListener('click', handleExtrasClick);
        extrasChoice.addEventListener('mouseover', handleExtrasMouseOver);
    })

    // This handles what happens when a user chooses the amount of colours that will be in their print

    function handlePrintColourAmountMouseClick()
    {
        
        let parentElement = this.parentElement;
        let children = parentElement.querySelectorAll('.colour-amount-block');  

        children.forEach(child => {
            child.classList.remove('border-hover');   
            child.removeEventListener('mouseover', handlePrintColourAmountMouseOver);  
            if (child.classList.contains('selected-border'))
            {
                child.classList.remove('selected-border')
                    
            }
        })

        this.classList.toggle('selected-border');
        let printColourAmount = this.getAttribute('data-colamnt');
        orderObj.colours_per_print = {"cpp" : printColourAmount}; 
        let printColourAmountImage = document.querySelector('.colour-amount-img-layer');
        printColourAmountImage.src = printColourAmountImages[printColourAmount];
        overviewGarmentCPPSetup(printColourAmount);        
    }

    // This handles what happens the mouseover functionality of the Print Amount Picker

    function handlePrintColourAmountMouseOver()
    {
        let printColourAmount = this.getAttribute('data-colamnt');
        let printColourAmountImage = document.querySelector('.colour-amount-img-layer');
        printColourAmountImage.src = printColourAmountImages[printColourAmount];
    }

    // Adds the event listener functionality to the section

    let printColourAmountChoices = document.querySelectorAll('.colour-amount-block');
    printColourAmountChoices.forEach(printColourAmountChoice => {
        printColourAmountChoice.addEventListener('click', handlePrintColourAmountMouseClick);
        printColourAmountChoice.addEventListener('mouseover', handlePrintColourAmountMouseOver);
    })

    // Handle The Print Position Interactivity

    function handlePrintPositionMouseClick()
    {
        
        let parentElement = this.parentElement;
        let children = parentElement.querySelectorAll('.print-position');  

        children.forEach(child => {
            child.classList.remove('border-hover');   
            child.removeEventListener('mouseover', handlePrintPositionMouseOver);  
            if (child.classList.contains('selected-border'))
            {
                child.classList.remove('selected-border')
                 
            }
        })

        this.classList.toggle('selected-border');
        let printPosition = this.getAttribute('data-position');
        orderObj.print_pos = printPosition; 
        let printPositionImage = document.querySelector('.print-position-img-layer');
        printPositionImage.src = printPositionUrls[printPosition];

        overviewGarmentPrintPosSetup(printPosition);
    }

    function handlePrintPositionMouseOver()
    {
        let printPosition = this.getAttribute('data-position');
        let printPositionImage = document.querySelector('.print-position-img-layer');
        printPositionImage.src = printPositionUrls[printPosition];
    }

    let printPositionChoices = document.querySelectorAll('.print-position');
    printPositionChoices.forEach(printPositionChoice => {
        printPositionChoice.addEventListener('click', handlePrintPositionMouseClick);
        printPositionChoice.addEventListener('mouseover', handlePrintPositionMouseOver);
    })

            
    // Setup print Position Picker 
    function setupPrintPositionPicker(productColourCode)
    {
        
        
        let imageWrap = document.querySelector('.position-choice-wrap');
        let combined = '#' + productColourCode;                
        imageWrap.style.backgroundColor = combined;


        /* let printPositionImage = document.querySelector('.print-position-img');
        printPositionImage.src = theSelectedImgUrl; */

    }

    // Setup Print Colour Amount Picker
    function setupPrintColourAmountPicker(productColourCode) 
    {   
        let coloursChoiceImageWrap = document.querySelector('.colours-choice-wrap');
        let combined = '#' + productColourCode;                
        coloursChoiceImageWrap.style.backgroundColor = combined;
    }

    // Handle The Click Choice Of Which Colour

    function handleColourPickerClick()
    {
        
        theSelectedImgUrl = this.getAttribute('data-imageurl');
        
        productColourCode = this.getAttribute('data-color-hex');

        orderObj.colour = productColourCode; 
        let combined = '#' + productColourCode;                
        setupPrintPositionPicker(productColourCode);
        setupPrintColourAmountPicker(productColourCode);
        overviewGarmentColourSetup(productColourCode);

        let parentElement = this.parentElement;
        let children = parentElement.querySelectorAll('.colour-block');        
        
        // once clicked remove hover css class

        children.forEach(child => {
            child.classList.remove('border-hover');   
            child.removeEventListener('mouseover', handleColourPickerMouseOver);  
            if (child.classList.contains('selected-border'))
            {
                child.classList.remove('selected-border')
                 
            }
        })   
        
        this.classList.toggle('selected-border');

        productColourCode = this.getAttribute('data-color-hex');
        let imageWrap = document.querySelector('.colour-choice-wrap');        
        imageWrap.style.backgroundColor = combined;
    }

    // Handle The Mouse Over Colour Picker

    function handleColourPickerMouseOver()
    {
        productColourCode = this.getAttribute('data-color-hex');
        let imageWrap = document.querySelector('.colour-choice-wrap');
        let combined = '#' + productColourCode;                
        imageWrap.style.backgroundColor = combined;
    }

    // sets up the sizes and prices associated
    function setupSizes(theData, productId) 
    {
        let theProduct = theData.filter(theData => theData.product_id == productId);
        let garmentSizes = theProduct[0].size_price_info;
        let inputContainer = document.querySelector('.item-amount-container');
        let sizeInputs = inputContainer.querySelectorAll('.item-amount-input');

        sizeInputs.forEach(sizeInput => {
            garmentSizes.forEach(garmentSize => {                
                if (sizeInput.attributes.name.value == garmentSize.size)
                {                    
                    sizeInput.setAttribute('data-price', garmentSize.price);
                }
            }) 
        })

    }


    // Sets up the colour picker after a colour is chosen

    function setupColourPicker(productId) 
    {
        let theData = getWooCommerceData();

        let theProduct = theData.filter(theData => theData.product_id == productId);
        setupSizes(theData, productId);
        
        let chosenProductFirstImage = document.querySelector('.colour-choice-img');
        let printPositionImg = document.querySelector('.print-position-img');
        let colourAmountImg = document.querySelector('.colour-amount-img');
        // print-position-img
        // colour-amount-img
        chosenProductFirstImage.src = theProduct[0].product_large_img_url;
        printPositionImg.src = theProduct[0].product_large_img_url;
        colourAmountImg.src = theProduct[0].product_large_img_url;

        let colours = theProduct[0].colour_info;        
        let colourBlock = '';
        let colourPicker = document.querySelector('.colour-picker');
        let colourBlocks = document.querySelector('.colour-choice-container').querySelectorAll('.colour-block');

        if (colourBlocks.length == 0)
        {
            colours.forEach(colour => {                   
                colourBlock = '<div class="colour-block border-hover" id="hex'+ colour.colour +'" data-id="'+ productId +'" data-color-hex ="'+ colour.colour +'"></div>';
                colourPicker.insertAdjacentHTML('beforeend', colourBlock);
                let combined = '#' + colour.colour;                
                document.querySelector('#hex' + colour.colour).style.backgroundColor  = combined;
                document.querySelector('#hex' + colour.colour).addEventListener('mouseover', handleColourPickerMouseOver);
                document.querySelector('#hex' + colour.colour).addEventListener('click', handleColourPickerClick);
            }); 
               
        }
        else
        {
            colourBlocks.forEach(block => {
                block.remove();
            })

            colours.forEach(colour => {   
            
                colourBlock = '<div class="colour-block border-hover" id="hex'+ colour.colour +'" data-id="'+ productId +'" data-color-hex ="'+ colour.colour +'"></div>';               
                colourPicker.insertAdjacentHTML('beforeend', colourBlock);
                let combined = '#' + colour.colour;
                document.querySelector('#hex' + colour.colour).style.backgroundColor  = combined;
                document.querySelector('#hex' + colour.colour).addEventListener('mouseover', handleColourPickerMouseOver);
                document.querySelector('#hex' + colour.colour).addEventListener('click', handleColourPickerClick);
            }); 
        }  
    }

    // Handles the choice of garment

    function handleGarmentClick(event)
    {
        let productId = this.getAttribute('data-id');
        orderObj.id = productId; 
        setupColourPicker(productId);
        overviewGarmentSetup(productId);
                
        let parentElement = this.parentElement;
        let children = parentElement.querySelectorAll('.product-type-container');        
        // once clicked remove hover css class and check if other choices are selected and de-select them
        
        children.forEach(child => {
            child.classList.remove('border-hover');   
            
            if (child.querySelector('.choice-type-container').classList.contains('selected-border'))
            {
                child.querySelector('.choice-type-container').classList.remove('selected-border');   
            }

            if (child.classList.contains('selected-border'))
            {
                child.classList.remove('selected-border');   
                
            }            
        }) 

        this.classList.toggle('selected-border');
        this.querySelector('.choice-type-container').classList.toggle('selected-border');        
    }

    function display_garment_choices(garmentData)
    {
        let size = Object.keys(garmentData).length;                
        let count = 0;
        // let productImageDivContainer = document.querySelector('.product-types-container');
        let slideContainer = document.querySelector('.product-types-container').querySelector('.slide-container');
        let productHTMLObject = '';
        garmentData.forEach(garment => {
            let productId = "product-" + garment['product_id'];            
            productHTMLObject = '<div class="slide"><div class="product-type-container border-hover" id="'+ productId +'" data-id="'+ garment['product_id'] +'" ><div class="choice-type-container"><p class="product-type-text">'+ garment['product_name'] +'</p></div></div></div>';
            slideContainer.insertAdjacentHTML('beforeend', productHTMLObject);
            document.querySelector('#'+productId).style.backgroundImage = "url('"+ garment.product_large_img_url +"')";
            document.querySelector('#'+productId).addEventListener('click', handleGarmentClick)
        });
        setTimeout(loadCarousel, 100);

    }

    function setWooCommerceData(data)
    {
        
        wooCommerceData = data;
        // console.log(wooCommerceData);

        let cppIndex = 0;
        let extrasIndex = 0;
        for (let i = 0; i < wooCommerceData.length; i++)
        {
            if (Array.isArray(wooCommerceData[i]))
            {
                for (let j = 0; j < wooCommerceData[i].length; j++)
                {
                    if ('cpp' in wooCommerceData[i][j])
                    {                        
                        cppIndex = i;
                    }

                    if ('extra' in wooCommerceData[i][j])
                    {                        
                        extrasIndex = i;
                    }
                }
            }
        }

        cppData = wooCommerceData[cppIndex];        
        extrasData = wooCommerceData[extrasIndex];        
        
        wooCommerceData.splice(cppIndex, 1);
        wooCommerceData.splice(extrasIndex - 1, 1);

        display_garment_choices(wooCommerceData);
        next(); 
    }

    function getWooCommerceData()
    {
        return wooCommerceData;
    }

    function get_garments_of_choice(theChoice)
    {
        const formData = new FormData();
        formData.append("garment_choice", theChoice);
        formData.append("action", 'get_garment_type');
        formData.append( 'garment_type_nonce', my_sec_obj.garment_type_nonce );

        let url = my_sec_obj.ajax_url;

        fetch( url, {
            method: 'POST',            
            body: formData,
        } ) 
            .then( res => res.json() )
            .then( garmentData => setWooCommerceData( garmentData ) )
            .catch( err => console.log( err ) ); 
    }

    function goToPage(pageNumber)
    {        
        setIndex(pageNumber);
        contents[pageNumber].scrollIntoView({ behavior: 'smooth'});
    }   

    function setIndex(pageNumber)
    {
        currentIndex = pageNumber;
        return currentIndex;
    }

    function getIndex()
    {
        return currentIndex;
    }

    function sendMessageToIframe(section)
    {
        switch(section) {
            case 1:                
                console.log('user has gone to first page using send message function again');
                window.top.postMessage('first-message', '*');
                break;            
          }
        
    }

    function next()
    {
        let currentPage = getIndex();        
        let nextPage = 0
        nextPage = currentPage + 1;        
        if ( nextPage < sectionMax)
        {
            goToPage(nextPage);
            sendMessageToIframe(nextPage);
        }
        else 
        {
            console.log('there is no next page');
        }
        
        
        
    } 

    function previous()
    {
        let currentPage = getIndex();        
        let nextPage = 0
        nextPage = currentPage -1;
        if ( nextPage > sectionMin)
        {
            goToPage(nextPage);
            sendMessageToIframe(nextPage);
        }
        else 
        {
            console.log('there is no next page');
        }
    } 

    garmentUses = document.querySelectorAll('.user-choice');
    garmentUses.forEach(function(choice){
        choice.addEventListener('click', function(){
            choice.querySelector('.choice-option-text').classList.toggle('garment-selected-text');
            choice.querySelector('.choice-description').classList.toggle('display-block');
            choice.classList.toggle('selected-border');
            theChoice = choice.querySelector('.choice-option-text').innerHTML.trim().toLowerCase();
            get_garments_of_choice(theChoice);
            updateOverviewTotals('setup');
        })        
    });

    nextButtons = document.querySelectorAll('.next');
    nextButtons.forEach(function(nextButton){
        nextButton.addEventListener('click', function(){            
            next();
        })        
    });

    previousButtons = document.querySelectorAll('.previous');
    previousButtons.forEach(function(previousButton){
        previousButton.addEventListener('click', function(){            
            previous();
        })        
    });

    /* Garment Carousel Logic */

    function loadCarousel()
    {
        console.log('loadCarousel called');
        let activeIndex = 0;
        let slides = document.querySelectorAll('.slide');
        let max = slides.length - 1;
        let min = 0;
        let leftSlideIndex = 0;
        let rightSlideIndex = 0;

        /* window.addEventListener('load', () => {
            
            slides[0].classList.add('active-slide');
            slides[1].classList.add('right-slide');    
            slides[max].classList.add('left-slide');

            for (let i = 2; i < max; i++)
            {
                slides[i].classList.add('right-slide');
            }
        }) */

        slides[0].classList.add('active-slide');
        slides[1].classList.add('right-slide');    
        slides[max].classList.add('left-slide');

        for (let i = 2; i < max; i++)
        {
            slides[i].classList.add('right-slide');
        }

        document.querySelector('.left-nav').addEventListener('click', function(){

            if (activeIndex - 1 < min)
            {
                activeIndex = max;
            }
            else
            {
                activeIndex -= 1;
            }

            if (activeIndex - 1 < min)
            {
                leftSlideIndex = max;
            }
            else 
            {
                leftSlideIndex = activeIndex - 1;
            }
            
            if (activeIndex + 1 > max)
            {
                rightSlideIndex = min;
            }
            else 
            {
                rightSlideIndex = activeIndex + 1;
            }

            slides[rightSlideIndex].classList.add('right-slide');
            slides[rightSlideIndex].classList.remove('active-slide');

            slides[activeIndex].classList.add('active-slide');
            slides[activeIndex].classList.remove('left-slide');

            slides[leftSlideIndex].classList.add('left-slide');
            slides[leftSlideIndex].classList.remove('right-slide');

            

            
        })

        document.querySelector('.right-nav').addEventListener('click', function(){            

            if (activeIndex + 1 > max)
            {
                activeIndex = 0;
            }
            else
            {
                activeIndex += 1;
            }
            
            if ( activeIndex - 1 < min) 
            {
                leftSlideIndex = max;
            }
            else
            {
                leftSlideIndex = activeIndex - 1;
            }

            if ( activeIndex + 1 > max) 
            {
                rightSlideIndex = min;
            }
            else
            {
                rightSlideIndex = activeIndex + 1;
            }
            

            slides[leftSlideIndex].classList.remove('active-slide');
            slides[leftSlideIndex].classList.add('left-slide');

            slides[activeIndex].classList.add('active-slide');
            slides[activeIndex].classList.remove('right-slide');

            slides[rightSlideIndex].classList.add('right-slide');
            slides[rightSlideIndex].classList.remove('left-slide');
        
        })
    }

     
   
  }());