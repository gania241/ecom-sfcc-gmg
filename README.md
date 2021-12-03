SFCC SFRA Backend Developer Test
========

This repository contains the assignment solution of GMG

### Considerations

*	This repository has below dependencies in order to integrate seamlessly into the sandbox instances.
* Please download the latest SFRA repository and place the root of the repository folder.
* Import the meta data details given in `metadata` folder. This includes product attributes and service details.
* Perform `npm install && npm run compile:js && npm compile:scss && npm run compile:fonts` in SFRA repogitory followed by GMG brand layer folder
* Upload these cartridge into SB via VSC/Eclipse.
* This repogitory contains two cartridges (don't forget to update in site path ex : `app_assignment_ext:int_sms:app_storefront_base`)
  1. `app_assignment_ext` : contains all brand storefront custamization and storefront hooks
  2. `int_sms` : contains integration of free SMS service https://www.fast2sms.com/ (free till 20 messsage)
* The folder should looks like below :

![image](https://user-images.githubusercontent.com/42370618/144613565-0f96a6ac-2a43-415e-85f3-87430697e679.png)



### STEP 1
Create a webhook to include three Custom Product attributes (Brand/MaxBuyQuantity/DiscountPercentage) into GET BASKET OCAPI
https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/OCAPI/current/shop/Resources/Baskets.html?cp=0_15_3_0

#### Solution:
   *	The webhook requirement is only for SHOP OCAPI basket GET resources but we should focus on adding product attributes to till add payment details - wherever basket details being sent back as response we should be getting these three extra attributes always. This makes an even more robust and scalable solution.The OCAPI hook `dw.ocapi.shop.basket.validateBasket` will be used since this hook is called every time when basket validation occurs. We could use `dw.ocapi.shop.basket.modifyGETResponse` but other steps where basket details being rendered , the attributes will not be available because it’s implement only one case..
   *	File Details : `cartridges\app_assignment_ext\hooks.json` and `cartridges\app_assignment_ext\cartridge\scripts\hooks\ocapi\basket.js`
   *	Find below postman details:
   ![image](https://user-images.githubusercontent.com/42370618/144611582-25542a8e-c386-4891-ab6a-26b8a72c2718.png)


### STEP 2
Create a Decorator in SFRA to show Colors and Inventory information (add specific stock information to the product details) on PDP. 
#### Solution:
*	This is duplicate requirement since PDP will call `cartridges\app_storefront_base\cartridge\models\product\fullProduct.js` model and this model alredy including variation attributes and availability decorators.
*	PFA below screen:
![image](https://user-images.githubusercontent.com/42370618/144612120-84665743-990e-4663-8c9f-92deacd887ad.png)

### STEP 3
Create a Service for SMS gateway and using Service framework send SMS to customer on Order Confirmation at Checkout
#### Solution:
*	New cartridge `int_sms` will be used for this integration.
*	Steps : BM create service, profile and credentials
*	One custom attribute created in service credential to store the api key. This is used during api call header set. Check `metadata` folder for more detail.
*	The hook `dw.sfcc.storefront.afterOrderPlace` created and triggered each time when order place.
*	Make a listener of this hook and trigger send email. For details follow `cartridges\app_assignment_ext\cartridge\controllers\CheckoutServices.js`, `cartridges\app_assignment_ext\hooks.json` and `cartridges\int_sms\cartridge\scripts\hooks\order.js`

### STEP 4
Test all the things. We are going to focus on functional tests. We can use MochaJs or whatever else tool, but we need to be able to run all the tests headless from the command line.

#### Solution:
*	The salesforce recommended technologies Mocha, Chai, Sinon and Proxyquire used here for unit testing. In these assignments most of the helpers and models are covered.
*	Use command `npm run test-assignment` to view the unit test run result.


### Wrapping up
*	All solutions have been committed in a single commit due to some internal access policies. In case any questions feel free to schedule a meeting so that I can explain the implementations in detail.

### Delivery
If your repository is private, please share it with [r.katyal@gmg.com]


