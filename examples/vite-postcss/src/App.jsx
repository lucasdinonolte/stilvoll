import cn from 'clsx';
import { sv } from 'stilvoll';
import './App.css';

function App() {
  return (
    <div className={cn(sv.flex, sv.flex_col, sv.gap_y_l)}>
      <div className={cn(sv.grid, sv.grid_cols_4)}>
        <div className={sv.col_span_2}>Hello</div>
        <div className={sv.col_span_2}>World</div>
      </div>
      <div className={cn(sv.flex, sv.flex_row, sv.flex_wrap, sv.gap_x_l)}>
        {['Hello', 'Bai', 'Ciao'].map((g) => (
          <span key={g}>{g}</span>
        ))}
      </div>
    </div>
  );
}

export default App;
