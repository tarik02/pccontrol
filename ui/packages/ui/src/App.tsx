import { Button, SegmentedControl } from '@mantine/core';
import { useCallback } from 'react';

import { RgbMode } from './components/RgbMode';
import { Stats } from './components/Stats';
import { useRemoteInput } from './hooks/useRemoteInput';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { switchMode } from './store/slices/mode';
import { sleep, wake } from './store/slices/power';


function App() {
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector(state => state.connection.isConnected);

  const [mode, setMode] = useRemoteInput(
    useAppSelector(state => state.mode.mode),
    async mode => {
      dispatch(switchMode(mode!));
    }
  );

  const onChangeMode = useCallback((name: string) => {
    setMode({
      name: name as 'silent' | 'idle' | 'semi' | 'perf',
    });
  }, [dispatch]);

  return (
    <div className="App flex flex-col grow w-[600px] max-w-[100%]">
      <SegmentedControl
        value={mode?.name}
        disabled={!isConnected || !mode}
        onChange={onChangeMode}
        className="w-full"
        orientation="vertical"
        size="xl"
        data={[
          {
            label: 'Silent',
            value: 'silent',
          },
          {
            label: 'Idle',
            value: 'idle',
          },
          {
            label: 'Semi',
            value: 'semi',
          },
          {
            label: 'Semi2',
            value: 'semi2',
          },
          {
            label: 'Perf',
            value: 'perf',
          },
        ]}
      />

      <RgbMode />

      <Stats />

      <div className="flex-1" />

      <div className="flex app-footer">
        <Button
          variant="outline"
          size="xl"
          className="flex-1"
          onClick={() => dispatch(wake())}
        >
          Wake
        </Button>
        <Button
          variant="outline"
          size="xl"
          className="flex-1"
          onClick={() => dispatch(sleep())}
        >
          Sleep
        </Button>
      </div>
    </div>
  );
}

export default App;
