import c from './Loader.module.css';
import loader from '../../img/loader.gif';

export const Loader = () => {
  return (
  <div className={c.loader}>
    <img width={100}
         height={100}
         src={loader}
         alt="loader" />
  </div>
  );
};
