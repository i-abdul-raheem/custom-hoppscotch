# Hoppscotch CLI <font size=2><sup>ALPHA</sup></font>

A CLI to run Hoppscotch Test Scripts in CI environments.

### **Commands:**

- `hopp test [options] [file]`: testing hoppscotch collection.json file

### **Usage:**

```bash
hopp [options or commands] arguments
```

### **Options:**

- `-v`, `--ver`: see the current version of the CLI
- `-h`, `--help`: display help for command

## **Command Descriptions:**

1. #### **`hopp -v` / `hopp --ver`**

   - Prints out the current version of the Hoppscotch CLI

2. #### **`hopp -h` / `hopp --help`**

   - Displays the help text

3. #### **`hopp test [options] <file_path>`**
   - Interactive CLI to accept Hoppscotch collection JSON path
   - Parses the collection JSON and executes each requests
   - Executes pre-request script.
   - Outputs the response of each request.
   - Executes and outputs test-script response.

    #### Options:

    ##### `-e <file_path>` / `--env <file_path>`

    - Accepts path to env.json with contents in below format:

        ```json
        {
            "ENV1":"value1",
            "ENV2":"value2"
        }
        ```

    - You can now access those variables using `pw.env.get('<var_name>')`

		Taking the above example, `pw.env.get("ENV1")` will return `"value1"`

## Install

Install [@hoppscotch/cli](https://www.npmjs.com/package/@hoppscotch/cli) from npm by running:
```
npm i -g @hoppscotch/cli
```

## **Developing:**

1. Clone the repository, make sure you've installed latest [pnpm](https://pnpm.io).
2. `pnpm install`
3. `cd packages/hoppscotch-cli`
4. `pnpm run build`
5. `sudo pnpm link --global`
6. Test the installation by executing `hopp`

## **Contributing:**

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](https://semver.org).
4. You may merge the Pull Request once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer merge it for you.

## Set Up The Development Environment

1. After cloning the repository, execute the following commands:

    ```bash
    pnpm install
    pnpm run build
    ```

2. In order to test locally, you can use two types of package linking:

    1. The 'pnpm exec' way (preferred since it does not hamper your original installation of the CLI):

        ```bash
        pnpm link @hoppscotch/cli

        // Then to use or test the CLI:
        pnpm exec hopp

        // After testing, to remove the package linking:
        pnpm rm @hoppscotch/cli
        ```

    2. The 'global' way (warning: this might override the globally installed CLI, if exists):

        ```bash
        sudo pnpm link --global

        // Then to use or test the CLI:
        hopp

        // After testing, to remove the package linking:
        sudo pnpm rm --global @hoppscotch/cli
        ```

3. To use the Typescript watch scripts:

      ```bash
      pnpm run dev
      ```
