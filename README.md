 Translator App

A real-time application that translate text to various languages. I used AWS services to provide scalable and efficient translation API. The entire application is deployed through an automated CI/CD pipeline.

![Screenshot of App](./translatorapplication.png)

### Deployed Link: 
https://main.d2n4vekoh5jo7l.amplifyapp.com/

## Features

- Real-Time Text Translation: Utilizes Amazon Translate for accurate and efficient language translation.
- Serverless Architecture: Built with AWS Lambda and API Gateway, eliminating the need for server management.
- RESTful API: Exposes a clean RESTful endpoint for easy integration with frontend applications.
- Infrastructure as Code (IaC): All AWS resources are defined using AWS Serverless Application Model (SAM) for consistent and repeatable deployments.
- Automated CI/CD: Features a continuous integration and continuous deployment pipeline using AWS CodePipeline and CodeBuild for seamless updates and deployments.
- CORS Enabled: Configured to allow cross-origin requests, facilitating integration with web frontends.

### Technologies Used
- AWS Lambda, AWS API Gateway, AWS CloudFormation, AWS CodePipeline, AWS CodeBuild, AWS IAM, Amazon S3, Amazon Translate, AWS SAM CLI, Node.js, YAML, React.js, CSS, HTML

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
