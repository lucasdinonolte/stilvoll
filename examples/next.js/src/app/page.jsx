import { sv } from 'stilvoll';

export default function Home() {
  return (
    <div className={sv.stack_l}>
      <div className={sv.grid.grid_cols_4}>
        <div className={sv.col_2}>Hello</div>
        <div className={sv.col_2}>Stilvoll</div>
      </div>
      <div className={sv.flex.gap_s}>
        <div>Cool</div>
        <div>Cool</div>
        <div>Cool</div>
      </div>
    </div>
  );
}
