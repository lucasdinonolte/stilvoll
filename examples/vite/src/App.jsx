import cn from 'clsx';
import { sv } from 'stilvoll';

function App() {
  return (
    <div className={cn(sv.flex, sv.items_center, sv.gap_l)}>
      <div className={sv.invisible}>
        OMG, typesafe utility classes, so nice.
      </div>
    </div>
  );
}

export default App;
