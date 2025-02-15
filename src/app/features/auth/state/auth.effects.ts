// In an application there is also a need to handle impure actions, such as AJAX requests, in NgRx we call them Effects.
// whenever an action has side effects we need to create an effect, an effect is a function that listens for specific actions and returns a new action and a payload of data.

/*
Effects when used along with Store, decrease the responsibility of the component.
In a larger application, this becomes more important because you have multiple sources of data,
with multiple services required to fetch those pieces of data,
and services potentially relying on other services.

Effects handle external data and interactions,
allowing your services to be less stateful and only perform tasks related to external interactions.
*/
