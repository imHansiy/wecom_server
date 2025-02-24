# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];

  # Sets environment variables in the workspace
  env = {
    DateBaseType = "mysql";
    NPM_CONFIG_PREFIX = "";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "zhuangtongfa.material-theme"
      "LaurentTreguier.vscode-simple-icons"
    ];

    # Enable previews
    previews = {
      enable = false;
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = { };
      # Runs when the workspace is (re)started
      onStart = {
        run-dev = "bash .idx/setup.sh";
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
      };
    };
  };
}
