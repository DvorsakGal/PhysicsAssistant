import grpc
import educational_pb2
import educational_pb2_grpc

def run():
    # Connect to the server
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = educational_pb2_grpc.EducationalServiceStub(channel)

        # Add educational data
        print("Adding educational data...")
        response = stub.AddEducationalData(educational_pb2.AddEducationalDataRequest(
            title="Newton's Laws of Motion",
            summary="An explanation of Newton's three laws of motion.",
            link="https://en.wikipedia.org/wiki",
        ))
        print(response.message)

        # Get educational data
        print("\nFetching educational data...")
        response = stub.GetEducationalData(educational_pb2.GetEducationalDataRequest(topic="Newton"))
        for data in response.data:
            print(f"Title: {data.title}, Content: {data.summary}, Created At: {data.created_at}")

        # Stream educational data
        print("\nStreaming all educational data...")
        for data in stub.StreamEducationalData(educational_pb2.Empty()):
            print(f"Title: {data.title}, Summary: {data.summary}, Created At: {data.created_at}")

if __name__ == "__main__":
    run()