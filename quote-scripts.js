console.log("quote-js loaded");

(function () {

    const form = document.getElementById('quote-form');
    
    let initialPrintPosColourChoiceSection = document.querySelector(".front-print-pos-section");

    document.addEventListener("DOMContentLoaded", function(){
        document.getElementById('quote-form').action = my_sec_obj.admin_url;
        document.querySelector("input[name='quote_nonce']").value = my_sec_obj.nonce;
    });
    
    
    
    function isARadioSelected( radioGroup)
    {   
        trueCount = 0;    

        for (let i = 0; i < radioGroup.length; i++)
        {
            if (radioGroup[i].checked)
            {
                trueCount++;
            }             
        }

        if (trueCount > 0)
            {
                return true;
            }
        else return false;
    }

    function setupNextPrintPosSection(frontOrBack, clone, printPosTotal, currentOptions)
    {
        let posString = printPosTotal.toString();
        let cloneRadios = clone.querySelectorAll("input");
        
        console.log(printPosTotal);
        console.log(clone);

        for (let i = 0; i < currentOptions.length; i++)
        {
            if ( !currentOptions[i].checked )
            {
                currentOptions[i].style.pointerEvents = "none";
            } 
        }

        for (let i = 0; i < cloneRadios.length; i++)
        {
            if ( cloneRadios[i].checked )
            {
                cloneRadios[i].disabled = true;
            }
            cloneRadios[i].checked = false;
            
            let printPosName = frontOrBack + "-print-pos-" + posString;
            clone.querySelectorAll("input")[i].name = printPosName;
        }
        clone.querySelector("select").name = frontOrBack + "-print-pos-colour-amount-" + posString;

        console.log(clone.querySelector("select"));
        
        return clone; 

    }

    let currentFrontPrintPos = document.querySelector(".front-print-pos-section");
    let currentFrontPrintPosOptions = currentFrontPrintPos.querySelectorAll('input');
    let buttonDiv = document.querySelector(".front-pos-button-container");
    let cleanClone = "";
    let checkedClone = "";
    let printPosCount = 0;
    let frontOrBack = "";

    let frontPrintPosTotal = 1;

    document.querySelector('.fpp').addEventListener('click', function(){
        console.log('Add another front position choice');
        
        currentFrontPrintPosOptions = currentFrontPrintPos.querySelectorAll('input');

        if (printPosCount < 5)
        {
            if ( isARadioSelected(currentFrontPrintPosOptions) )
            {
                console.log('A choice has been made');

                frontPrintPosTotal++;

                checkedClone = currentFrontPrintPos.cloneNode(true);
                
                frontOrBack = "front"
                cleanClone = setupNextPrintPosSection(frontOrBack, checkedClone, frontPrintPosTotal, currentFrontPrintPosOptions);

                buttonDiv.insertAdjacentElement('beforebegin', cleanClone); 
            }
            else 
            {
                alert("Please select one position before adding another!");
            }

            currentFrontPrintPos = cleanClone;
            printPosCount++;
        }
        else
        {
            alert("You have chosen all the available print positions!");
        }

        
        
    });  

    let currentBackPrintPos = document.querySelector(".back-print-pos-section");
    let currentBackPrintPosOptions = currentBackPrintPos.querySelectorAll('input');
    
    let backButtonDiv = document.querySelector(".back-pos-button-container");
    let backPrintPosTotal = 1;
    let backPrintPosCount = 0;

    let cleanBackClone = "";
    let checkedBackClone = "";

    document.querySelector('.bpp').addEventListener('click', function(){
        console.log('Add another back position choice');
        
        currentBackPrintPosOptions = currentBackPrintPos.querySelectorAll('input');

        if (backPrintPosCount < 5)
        {
            if ( isARadioSelected(currentBackPrintPosOptions) )
            {
                console.log('A choice has been made');

                backPrintPosTotal++;

                checkedBackClone = currentBackPrintPos.cloneNode(true);
                
                frontOrBack = "back"
                cleanBackClone = setupNextPrintPosSection(frontOrBack, checkedBackClone, backPrintPosTotal, currentBackPrintPosOptions);

                backButtonDiv.insertAdjacentElement('beforebegin', cleanBackClone); 
            }
            else 
            {
                alert("Please select one position before adding another!");
            }

            currentBackPrintPos = cleanBackClone;
            backPrintPosCount++;
        }
        else
        {
            alert("You have chosen all the available print positions!");
        }

        
        
    }); 
    /* form.addEventListener('submit', function(event){
        
        event.preventDefault();    
        
        let formattedFormData = new FormData(form);
        //let formattedFormData = new FormData();
        formattedFormData.append("action", 'process_quote');
        
        let url = my_ajax_obj.ajax_url;
        let nonce = my_ajax_obj.nonce;

       
        console.log(url);
        console.log(nonce);

        fetch( url+"?action=process_quote&security="+nonce, {
            method: 'POST',            
            body: formattedFormData,
        } ) // wrapped
            .then( res => res.text() )
            .then( data => console.log( data ) )
            .catch( err => console.log( err ) ); 
    }); */
   
  }());