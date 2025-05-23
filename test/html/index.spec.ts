import bakePiSpec from './bake-pi.spec';
import componentsSpec from './components/index.spec';
import piCrustSpec from './pi-crust.spec';
import piFillingsSpec from './pi-fillings.spec';
import piFlavorsSpec from './pi-flavors.spec';
import piTinSpec from './pi-tin.spec';
import piToppingsSpec from './pi-toppings.spec';

describe('html', () => {
  componentsSpec();
  bakePiSpec();
  piFillingsSpec();
  piCrustSpec();
  piFlavorsSpec();
  piTinSpec();
  piToppingsSpec();
});
