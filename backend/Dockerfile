# Step 1: Use an official Python runtime as a parent image

FROM python:3.12-slim
 
# Step 2: Set the working directory inside the container

WORKDIR /app
 
# Step 3: Copy requirements.txt and install dependencies

COPY requirements.txt .
 
RUN pip install --no-cache-dir -r requirements.txt
 
# Step 4: Copy the rest of the application code

COPY . .
 
# Step 5: Expose the port your app runs on

EXPOSE 8000
 
# Step 6: Set the default command to run your application

# Replace 'app:app' with your entry point module and application object

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

 