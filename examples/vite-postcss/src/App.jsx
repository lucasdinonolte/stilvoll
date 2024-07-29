import { sv } from 'stilvoll';
import './App.css'

function App() {
  return (
    <div className={sv.flex.flex_col.gap_y_l}>
    <div className={sv.grid.grid_cols_4}>
      <div className={sv.col_span_2}>Hello</div>
      <div className={sv.col_span_2}>World</div>
    </div>
    <div className={sv.flex.flex_row.flex_wrap.gap_x_l}>
      {['Hello', 'Bai', 'Ciao'].map(g => (<span key={g}>{g}</span>))}
    </div>
    </div>
  )
}

export default App
