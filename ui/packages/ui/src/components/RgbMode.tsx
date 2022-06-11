import { ColorPicker, SegmentedControl, Slider } from '@mantine/core';
import { useCallback } from 'react';

import { useRemoteInput } from '~/hooks/useRemoteInput';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Mode, ModeColorcycle, ModeNames, ModeStatic, switchMode } from '../store/slices/rgb';


type ModeProps<T extends Mode> = {
  params: T['params'];
  onChange: (mode: T['params']) => void;
}

const StaticRgbMode = (props: ModeProps<ModeStatic>) => {
  const { color } = props.params;

  const onChangeColor = useCallback((value: string | undefined) => {
    if (!value) {
      return;
    }
    const [, r, g, b] = value.match(/rgb\((\d+), (\d+), (\d+)\)/)!;
    props.onChange({
      color: {
        r: parseInt(r),
        g: parseInt(g),
        b: parseInt(b),
      },
    });
  }, [props.onChange]);

  return (
    <ColorPicker
      fullWidth
      size="xl"
      format="rgb"
      className="mt-5 mx-auto"
      value={`rgb(${ color.r }, ${ color.g }, ${ color.b })`}
      onChange={onChangeColor}
    />
  );
};

const ColorcycleRgbMode = (props: ModeProps<ModeColorcycle>) => {
  const { speed } = props.params;

  const onChangeSpeed = useCallback((value: number) => {
    props.onChange({
      speed: value,
    });
  }, [props.onChange]);

  return (
    <Slider
      className="mt-10"
      value={speed}
      onChange={onChangeSpeed}
      size="lg"
      min={0.1}
      max={10}
    />
  );
};

export const RgbMode = () => {
  const dispatch = useAppDispatch();

  const [mode, setMode] = useRemoteInput(
    useAppSelector(state => state.rgb.mode),
    async mode => {
      await dispatch(switchMode(mode));
    }
  );

  const onSwitchMode = useCallback((value: string) => {
    switch (value as ModeNames) {
    case 'default':
      setMode({ name: 'default' });
      break;

    case 'static':
      setMode({
        name: 'static',
        params: {
          color: {
            r: 255,
            g: 255,
            b: 255,
          },
        },
      });
      break;

    case 'colorcycle':
      setMode({
        name: 'colorcycle',
        params: {
          speed: 0.2,
        },
      });
      break;
    }
  }, [setMode]);

  const onSetModeParams = useCallback((params: any) => {
    setMode({
      name: mode.name,
      params,
    });
  }, [mode, dispatch]) as any;

  return (
    <div className="mt-5">
      <SegmentedControl
        value={mode.name}
        onChange={onSwitchMode}
        data={[
          {
            label: 'Default',
            value: 'default',
          },
          {
            label: 'Static',
            value: 'static',
          },
          {
            label: 'Colorcycle',
            value: 'colorcycle',
          },
        ]}
        className="w-full"
      />

      {mode.name === 'static' &&
        <StaticRgbMode
          params={mode.params}
          onChange={onSetModeParams}
        />
      }

      {mode.name === 'colorcycle' &&
        <ColorcycleRgbMode
          params={mode.params}
          onChange={onSetModeParams}
        />
      }
    </div>
  );
};
