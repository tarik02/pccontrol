type Bazify<B, F extends readonly (keyof B)[]> = {
  [K in keyof F]: F[K] extends F[number] ? B[F[K]] : never;
};

export type App<Singletons> = {
  <Name extends keyof Singletons>(name: Name): Singletons[Name];

  register: <Name extends keyof Singletons, Deps extends readonly (Exclude<keyof Singletons, Name>)[]>(
    name: Name,
    ...depsAndFactory: [...Deps, (...deps: Bazify<Omit<Singletons, Name>, Deps>) => Singletons[Name]]
  ) => void;

  subscribe: <Name extends keyof Singletons>(name: Name, subscriber: (value: Singletons[Name]) => void) => () => void;

  use: (cb: (app: App<Singletons>) => void) => App<Singletons>;
};

type AppObject<Singletons, Name extends keyof Singletons> = {
  value: Singletons[Name] | undefined;
  factory: () => void;
  reset: () => void;
  dependents: Set<Omit<keyof Singletons, Name>>;
  subscribers: ((value: Singletons[Name]) => void)[];
};

export const createApp = <Singletons>(): App<Singletons> => {
  type SelfType = App<Singletons>;

  const objects: {
    [Name in keyof Singletons]?: AppObject<Singletons, Name>;
  } = {};

  const getObject = <Name extends keyof Singletons>(name: Name): AppObject<Singletons, Name> => {
    if (!(name in objects)) {
      objects[name] = {
        value: undefined,
        factory: () => {
          throw new Error(`Object "${ name }" is not registered in container`);
        },
        reset: () => {
          //
        },
        dependents: new Set(),
        subscribers: [],
      };
    }

    return objects[name]!;
  };

  const register: SelfType['register'] = (name, ...depsAndFactory) => {
    const depNames = depsAndFactory.slice(0, -1) as (keyof Singletons)[];
    const factory = depsAndFactory[depsAndFactory.length - 1];

    const object = getObject(name);

    object.factory = () => {
      const instantiatedDeps: any[] = [];

      for (const depName of depNames) {
        const depObject = getObject(depName);
        if (depObject.value === undefined) {
          depObject.factory();
        }
        depObject.dependents.add(name);
        instantiatedDeps.push(depObject.value);
      }

      const instance = (factory as any)(...instantiatedDeps);
      object.value = instance;

      object.subscribers.forEach(subscriber => subscriber(instance));
    };

    if (object.value !== undefined) {
      object.reset();
    }

    object.reset = () => {
      for (const depName of depNames) {
        getObject(depName).dependents.delete(name);
      }

      object.value = undefined;
      object.factory();

      for (const dependent of [...object.dependents]) {
        getObject(dependent as keyof Singletons).reset();
      }
    };
  };

  const subscribe: SelfType['subscribe'] = (name, subscriber) => {
    const object = getObject(name);

    object.subscribers.push(subscriber);

    return () => {
      const index = object.subscribers.indexOf(subscriber);

      if (index !== -1) {
        object.subscribers.splice(index, 1);
      }
    };
  };

  const result = ((name: keyof Singletons) => {
    const object = getObject(name);
    if (object.value === undefined) {
      object.factory();
    }
    return object.value!;
  }) as any as App<Singletons>;

  result.register = register;
  result.subscribe = subscribe;
  result.use = cb => {
    cb(result);
    return result;
  };

  return result;
};
