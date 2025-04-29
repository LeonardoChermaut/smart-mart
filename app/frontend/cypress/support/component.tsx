import "./commands.ts";

import { mount, MountOptions, MountReturn } from "@cypress/react";
import "@testing-library/cypress/add-commands";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";

type CustomMountOptions = MountOptions & {
  routerProps?: MemoryRouterProps;
  queryClient?: QueryClient;
};

declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: React.ReactNode,
        options?: CustomMountOptions
      ): Cypress.Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add(
  "mount",
  (component: React.ReactNode, options: CustomMountOptions = {}) => {
    const {
      routerProps = { initialEntries: ["/"] },
      queryClient,
      ...mountOptions
    } = options;

    const wrapped = (
      <MemoryRouter {...routerProps}>
        <QueryClientProvider client={queryClient || new QueryClient()}>
          {component}
        </QueryClientProvider>
      </MemoryRouter>
    );

    return mount(wrapped, mountOptions);
  }
);
