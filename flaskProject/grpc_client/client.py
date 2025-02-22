import grpc
from grpc_client import educational_pb2, educational_pb2_grpc


# Helper function to connect to the gRPC server
def get_grpc_stub():
    channel = grpc.insecure_channel('localhost:50051')  # Update with the actual gRPC server address
    return educational_pb2_grpc.EducationalServiceStub(channel)


def fetch_educational_data(title):
    stub = get_grpc_stub()
    request = educational_pb2.GetEducationalDataRequest(title=title)
    response = stub.GetEducationalData(request)
    return response.data


def add_educational_data(title, summary, link, level):
    stub = get_grpc_stub()
    request = educational_pb2.AddEducationalDataRequest(title=title, summary=summary, link=link, level=level)
    response = stub.AddEducationalData(request)
    return response.message


def remove_educational_data(title):
    stub = get_grpc_stub()
    request = educational_pb2.DeleteEducationalDataRequest(title=title)
    response = stub.DeleteEducationalData(request)
    return response.message


def stream_educational_data(title):
    stub = get_grpc_stub()
    request = educational_pb2.StreamEducationalDataRequest(title=title)
    for response in stub.StreamEducationalData(request):
        yield {
            'title': response.title,
            'summary': response.summary,
            'link': response.link,
            'created_at': response.created_at
        }

