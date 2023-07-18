import { firstValueFrom } from 'rxjs';

import { state$ } from '@/server/status/pccontrol';

import { App } from './parts/App';

export default async function Home() {
    const state = await firstValueFrom(state$);

    return (
        <App
            initialState={ state }
        />
    );
}
