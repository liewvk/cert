import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor {
    public type Certificate = {
        id: Text;
        name: Text;
        course: Text;
        date: Text;
        grade: Text;
    };

    private var certificates = Map.HashMap<Text, Certificate>(0, Text.equal, Text.hash);
    private stable var nextId : Nat = 0;

    // Create certificate - returns ID of created certificate
    public func addCertificate(name: Text, course: Text, date: Text, grade: Text) : async Text {
        let id = Nat.toText(nextId);
        nextId += 1;

        let cert : Certificate = {
            id = id;
            name = name;
            course = course;
            date = date;
            grade = grade;
        };

        certificates.put(id, cert);
        Debug.print("Created certificate with ID:" # id);
        id
    };

    // Get single certificate
    public query func getCertificate(id: Text) : async ?Certificate {
        certificates.get(id)
    };

    // Get all certificates
    public query func listCertificates() : async [Certificate] {
        let buf = Buffer.Buffer<Certificate>(0);
        for ((_, cert) in certificates.entries()) {
            buf.add(cert);
        };
        Buffer.toArray<Certificate>(buf)
    };
}