{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    utils.url = "github:numtide/flake-utils";
    language-servers = {
      url = "git+https://git.sr.ht/~bwolf/language-servers.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    utils,
    language-servers,
  }:
    utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      devShell = with pkgs;
        mkShell {
          buildInputs = [
            nodejs
            nodePackages."@angular/cli"
            language-servers.packages.angular-language-server
          ];
        };
    });
}
