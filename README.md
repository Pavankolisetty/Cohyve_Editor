# Cohyve Editor

Cohyve Editor is an advanced collaborative code editor designed to facilitate seamless real-time collaboration between developers. This editor supports multiple programming languages and provides features that enhance productivity and code quality.

## Features

- **Real-Time Collaboration**: Work together with your team in real-time with synchronized editing capabilities.
- **Multi-Language Support**: Supports multiple programming languages to cater to diverse development needs.
- **Commenting System**: Add, resolve, and manage comments directly within the code editor.
- **Code Review**: Conduct thorough code reviews with inline comments and suggestions.
- **Version Control Integration**: Integrates with popular version control systems for streamlined workflow.
- **Syntax Highlighting**: Provides syntax highlighting for better code readability.
- **Customizable Themes**: Choose from a variety of themes to suit your coding style.
- **Extensions and Plugins**: Support for extensions and plugins to add additional functionality.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/pavan-kumar-cohyve/cohyve_editor.git
   cd cohyve_editor
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the development server:
   ```sh
   npm start
   ```

5. Open your browser and go to `http://localhost:5000` to access the editor.

## Usage

1. **Creating a New Project**:
   - Click on the "New Project" button on the dashboard.
   - Enter the project name and select the programming language.
   - Start coding and invite your team members to collaborate.

2. **Adding Comments**:
   - Highlight the code you want to comment on.
   - Click on the "Add Comment" button and enter your comment.
   - Resolve comments once the necessary changes have been made.

3. **Code Review**:
   - Submit your code for review by clicking on the "Request Review" button.
   - Reviewers can add inline comments and suggestions.
   - Make the required changes and mark the comments as resolved.

## Contributing

We welcome contributions from the community. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries, please contact Pavan Kumar at [kolisettypavan2003@](mailto:kolisettypavan2003@).
