import { useAppSelector } from '../store/hooks';


export const Stats = () => {
  const stats = useAppSelector(state => state.stats.current);

  return (
    stats ?
      <div>
        <div>
          { `CPU: ${ Math.round(stats.temps.cpu) }°C` }
        </div>
        <div>
          { `GPU: ${ Math.round(stats.temps.gpu) }°C` }
        </div>
      </div> :
      <>
      </>
  );
};
