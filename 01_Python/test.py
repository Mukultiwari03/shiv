class sample:

    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"this is a custom print message for name - {self.name}"


a = sample("shivam")
print(a)