import actionHandlerDelegateSpec from './action-handler-delegate.spec';
import retrieversDelegate from './retrievers/index.spec';
import utilsSpec from './utils/index.spec';
describe('delegates', () => {
  retrieversDelegate();
  utilsSpec();
  actionHandlerDelegateSpec();
});
